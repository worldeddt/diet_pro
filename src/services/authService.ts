import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  activityLevel: string;
}

export interface SignUpResponse {
  userId: string;
  email: string;
  name: string;
  message: string;
}

class AuthService {
  private baseURL = 'http://localhost:8082/api/auth';

  // 토큰 저장
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken],
      ]);
    } catch (error) {
      console.error('토큰 저장 실패:', error);
      throw error;
    }
  }

  // 사용자 정보 저장
  async saveUserInfo(userInfo: UserInfo): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    } catch (error) {
      console.error('사용자 정보 저장 실패:', error);
      throw error;
    }
  }

  // 액세스 토큰 가져오기
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('액세스 토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 리프레시 토큰 가져오기
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('리프레시 토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 사용자 정보 가져오기
  async getUserInfo(): Promise<UserInfo | null> {
    try {
      const userInfoString = await AsyncStorage.getItem(USER_INFO_KEY);
      return userInfoString ? JSON.parse(userInfoString) : null;
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      return null;
    }
  }

  // 모든 데이터 삭제 (로그아웃)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_INFO_KEY]);
    } catch (error) {
      console.error('데이터 삭제 실패:', error);
      throw error;
    }
  }

  // 로그인
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/email/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인에 실패했습니다.');
      }

      const data: LoginResponse = await response.json();
      
      // 토큰과 사용자 정보 저장
      await this.saveTokens(data.accessToken, data.refreshToken);
      await this.saveUserInfo({
        id: data.email, // 임시로 email을 id로 사용
        email: data.email,
        name: data.name,
      });

      return data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  }

  // 회원가입
  async signUp(signUpData: SignUpRequest): Promise<SignUpResponse> {
    try {
      const response = await fetch(`${this.baseURL}/email/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      const data: SignUpResponse = await response.json();
      return data;
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  }

  // 토큰 갱신
  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }

      const response = await fetch(`${this.baseURL}/email/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // 리프레시 토큰도 만료된 경우
        await this.clearAll();
        throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
      }

      const data: LoginResponse = await response.json();
      
      // 새로운 토큰 저장
      await this.saveTokens(data.accessToken, data.refreshToken);
      await this.saveUserInfo({
        id: data.email,
        email: data.email,
        name: data.name,
      });

      return data;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      throw error;
    }
  }

  // 로그아웃
  async logout(): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      if (accessToken) {
        // 서버에 로그아웃 요청
        await fetch(`${this.baseURL}/email/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      // 로컬 데이터 삭제
      await this.clearAll();
    }
  }

  // 인증된 요청을 위한 헤더 생성
  async getAuthHeaders(): Promise<Record<string, string>> {
    const accessToken = await this.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    };
  }

  // API 요청 래퍼 (자동 토큰 갱신 포함)
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // 401 에러인 경우 토큰 갱신 시도
    if (response.status === 401) {
      try {
        await this.refreshToken();
        
        // 새로운 토큰으로 재시도
        const newHeaders = await this.getAuthHeaders();
        return fetch(url, {
          ...options,
          headers: {
            ...newHeaders,
            ...options.headers,
          },
        });
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        await this.clearAll();
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
    }

    return response;
  }
}

export default new AuthService();

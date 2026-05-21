import type {
  LoginResponse,
  UserProfileResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  ClientListResponse,
  ConsultantListResponse,
  CreateCadenceScheduleRequest,
  CreateCadenceScheduleResponse,
  CadenceSessionsResponse,
  CadenceSessionSummaryResponse,
  UpdateCadenceSessionRequest,
} from "./types";

const getBaseUrl = () => {
  const base = import.meta.env.VITE_BASE_URL || "http://localhost:8000/";
  return base.endsWith("/") ? base : `${base}/`;
};

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errMsg = "Invalid credentials";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {
      // Ignore JSON parsing errors and fallback
    }
    throw new Error(errMsg);
  }

  return response.json();
}

export async function getUserProfile(userId: number): Promise<UserProfileResponse> {
  const baseUrl = getBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("j2w_token") : null;
  const response = await fetch(`${baseUrl}api/hrbp/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errMsg = "Failed to fetch profile details";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }
    throw new Error(errMsg);
  }

  return response.json();
}

export async function updateUserProfile(
  userId: number,
  payload: UpdateUserProfileRequest,
): Promise<UpdateUserProfileResponse> {
  const baseUrl = getBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("j2w_token") : null;
  const response = await fetch(`${baseUrl}api/hrbp/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errMsg = "Failed to update profile details";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }
    throw new Error(errMsg);
  }

  return response.json();
}

export async function getClientsApi(hrbpId: number): Promise<ClientListResponse> {
  const baseUrl = getBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("j2w_token") : null;
  const response = await fetch(`${baseUrl}api/hrbp/clients?hrbp_id=${hrbpId}&per_page=-1`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errMsg = "Failed to fetch clients";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
}

export async function getConsultantsApi(
  hrbpId: number,
  clientId: number,
): Promise<ConsultantListResponse> {
  const baseUrl = getBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("j2w_token") : null;
  const response = await fetch(
    `${baseUrl}api/hrbp/consultants?hrbp_id=${hrbpId}&client_id=${clientId}&per_page=-1`,
    {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    let errMsg = "Failed to fetch consultants";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
}

export async function createCadenceScheduleApi(
  payload: CreateCadenceScheduleRequest,
): Promise<CreateCadenceScheduleResponse> {
  const baseUrl = getBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("j2w_token") : null;
  const response = await fetch(`${baseUrl}api/hrbp/cadence-schedules`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errMsg = "Failed to create cadence schedule";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
}

export async function getCadenceSessionsApi(params: {
  hrbp_id: number;
  scheduled_date?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page_no?: number;
  per_page?: number;
}): Promise<CadenceSessionsResponse> {
  const baseUrl = getBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("j2w_token") : null;

  const queryParams = new URLSearchParams({
    hrbp_id: String(params.hrbp_id),
    per_page: String(params.per_page ?? -1),
  });
  if (params.page_no !== undefined) {
    queryParams.append("page_no", String(params.page_no));
  }
  if (params.scheduled_date) {
    queryParams.append("scheduled_date", params.scheduled_date);
  }
  if (params.status) {
    queryParams.append("status", params.status);
  }
  if (params.date_from) {
    queryParams.append("date_from", params.date_from);
  }
  if (params.date_to) {
    queryParams.append("date_to", params.date_to);
  }

  const response = await fetch(
    `${baseUrl}api/hrbp/cadence-schedules/sessions?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    let errMsg = "Failed to fetch cadence sessions";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
}

export async function getCadenceSessionsSummaryApi(
  hrbpId: number,
): Promise<CadenceSessionSummaryResponse> {
  const baseUrl = getBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("j2w_token") : null;

  const response = await fetch(
    `${baseUrl}api/hrbp/cadence-schedules/sessions/summary?hrbp_id=${hrbpId}`,
    {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    let errMsg = "Failed to fetch cadence sessions summary";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
}

export async function updateCadenceSessionApi(
  scheduleId: number,
  sessionId: number,
  payload: UpdateCadenceSessionRequest,
): Promise<any> {
  const baseUrl = getBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("j2w_token") : null;

  const response = await fetch(
    `${baseUrl}api/hrbp/cadence-schedules/${scheduleId}/sessions/${sessionId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    let errMsg = "Failed to update cadence session";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
}

export async function getCadenceScheduleSessionsApi(
  scheduleId: number,
): Promise<CadenceSessionsResponse> {
  const baseUrl = getBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("j2w_token") : null;

  const response = await fetch(
    `${baseUrl}api/hrbp/cadence-schedules/${scheduleId}/sessions?per_page=-1`,
    {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    let errMsg = "Failed to fetch cadence schedule sessions";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg = errData.detail;
      }
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
}

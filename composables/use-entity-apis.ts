export const useEntityApis = () => {
  const api = useApis()

  return {
    // User APIs
    user: {
      login: (username: string, password: string) => {
        const formData = new URLSearchParams()
        formData.append('username', username)
        formData.append('password', password)
        return api.postRaw<ZdSession>('/user/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      }
    },

    // Project APIs
    project: {
      get: (id: number) => api.get<ZdProject>(`/project/${id}`),
      getByPage: (page: number, size: number) => api.get<VOPaged<ZdProject>>('/project/', { page, size }),
      create: (data: ZdProject) => api.post<ZdProject>('/project/', data),
      update: (data: ZdProject) => api.put<ZdProject>('/project', data),
      delete: (id: number) => api.delete<ZdProject>(`/project/${id}`)
    },

    // Component APIs
    component: {
      getAll: () => api.get<VOList<ZdComponent>>('/component/all'),
      get: (id: number) => api.get<ZdComponent>(`/component/${id}`),
      getByPage: (page: number, size: number) => api.get<VOPaged<ZdComponent>>('/component/', { page, size }),
      create: (data: ZdComponent) => api.post<ZdComponent>('/component/', data),
      update: (data: ZdComponent) => api.put<ZdComponent>('/component', data),
      delete: (id: number) => api.delete<ZdComponent>(`/component/${id}`)
    },

    // Parameter APIs
    parameter: {
      get: (id: number, type: string) => api.get<Array<ZdParameter>>('/parameter', { type, id }),
      create: (data: ZdParameter) => api.post<ZdParameter>('/parameter', data),
      createBatch: (data: Array<ZdParameter>) => api.post<boolean>('/parameter/batch', data),
      updateBatch: (data: Array<ZdParameter>) => api.put<boolean>('/parameter/batch', data),
      delete: (id: number) => api.delete<ZdParameter>(`/parameter/${id}`)
    },

    configuration: {
      get: (id: number) => api.get<ZdConfiguration>(`/configuration/${id}`),
      getByTemplateId: (templateId: number, projectId: number) => api.get<ZdConfiguration>('/configuration/', { tid: templateId, pid: projectId }),
      create: (data: ZdConfiguration) => api.post<ZdConfiguration>('/configuration/', data),
      update: (data: ZdConfiguration) => api.put<ZdConfiguration>('/configuration', data),
      delete: (id: number) => api.delete<ZdConfiguration>(`/configuration/${id}`)
    },

    // Template APIs
    template: {
      get: (id: number) => api.get<ZdTemplate>(`/template/${id}`),
      getByPage: (page: number, size: number) => api.get<VOPaged<ZdTemplate>>('/template/', { page, size }),
      create: (data: ZdTemplate) => api.post<ZdTemplate>('/template/', data),
      update: (data: ZdTemplate) => api.put<ZdTemplate>('/template', data),
      delete: (id: number) => api.delete<ZdTemplate>(`/template/${id}`),
    },

    template_psystem: {
      getByTemplateId: (templateId: number) => api.get<VOList<ZdPSystem>>(`/template/${templateId}/pSystem`),
      create: (data: ZdPSystem) => api.post<ZdPSystem>('/pSystem/', data),
      createBatch: (data: Array<ZdPSystem>) => api.post<boolean>('/pSystem/batch', data), 
      // update: (data: ZdPSystem) => api.put<ZdPSystem>('/pSystem', data),
      updateBatch: (data: Array<ZdPSystem>) => api.put<boolean>('/pSystem/batch', data),
      delete: (id: number) => api.delete<ZdPSystem>(`/pSystem/${id}`)
    },

    // Product Type APIs
    ptype: {
      getAll: () => api.get<Array<ZdPType>>('/pType/'),
      get: (id: number) => api.get<ZdPType>(`/pType/${id}`),
      create: (data: ZdPType) => api.post<ZdPType>('/pType/', data),
      update: (data: ZdPType) => api.put<ZdPType>('/pType', data),
      delete: (id: number) => api.delete<ZdPType>(`/pType/${id}`)
    },

    // Product System APIs
    psystem: {
      getAll: (require_tree: boolean = false) => api.get<Array<ZdPSystem>>('/pSystem/tree', { require_tree }),
      get: (id: number) => api.get<ZdPSystem>(`/pSystem/${id}`),
      getByPage: (page: number, size: number) => api.get<VOPaged<ZdPSystem>>('/pSystem/', { page, size }),
      create: (data: ZdPSystem) => api.post<ZdPSystem>('/pSystem/', data),
      update: (data: ZdPSystem) => api.put<ZdPSystem>('/pSystem', data),
      delete: (id: number) => api.delete<ZdPSystem>(`/pSystem/${id}`),
    },

    // Template Component APIs
    template_component: {
      getByTemplateId: (templateId: number) => api.get<VOList<ZdTComponent>>('/tComponent/', { tid: templateId }),
      create: (data: ZdTComponent) => api.post<ZdTComponent>('/tComponent/', data),
      createBatch: (data: Array<ZdTComponent>) => api.post<boolean>('/tComponent/batch', data),
      update: (data: ZdTComponent) => api.put<ZdTComponent>('/tComponent', data),
      updateBatch: (data: Array<ZdTComponent>) => api.put<boolean>('/tComponent/batch', data),
      delete: (id: number) => api.delete<ZdTComponent>(`/tComponent/${id}`)
    }
  }
} 
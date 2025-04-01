export const useEntityApis = () => {
  const api = useApis(), systemApi = useApis('http://localhost:6990')
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string || ''

  return {
    // User APIs
    user: {
      login: async (username: string, password: string) => {
        const formData = new URLSearchParams()
        formData.append('username', username)
        formData.append('password', password)
        
        // 创建AbortController用于超时控制
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时
        
        try {
          // 使用原生fetch替代api.postRaw
          const response = await fetch(`${apiBase}/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData,
            signal: controller.signal
          })
          
          // 清除超时
          clearTimeout(timeoutId)
          
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`登录失败: ${response.status} - ${errorText}`)
          }
          
          return await response.json()
        } catch (error) {
          clearTimeout(timeoutId)
          console.error('登录请求失败:', error)
          throw error
        }
      },
      logout: () => api.get<null>('/sysUser/logout'),
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
      update: (data: ZdParameter) => api.put<ZdParameter>('/parameter', data),
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
    },

    item: {
      get: (id: string) => api.get<ZdItem>(`/item/${id}`),
      getByPage: (query: ZdItemQuery) => api.get<ZdItemPaged>(`/item`, {}, {
        body: query,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    bom: {
      get: (id: number) => api.get<ZdBom>(`/bom/${id}`),
      create: (data: ZdBom) => api.post<ZdBom>('/bom', data),
      update: (data: ZdBom) => api.put<ZdBom>('/bom', data),
      data: (id: number) => api.delete<ZdBom>(`/bom/${id}`)
    },

    specification: {
      getAll: (id: number) => api.get<ZdSpecification>(`/specification/tree/${id}`),
      render: (configId: number, body: ZdSpecificationQuery) => api.get<object>('/specification/rendering', { configId }, {
        body, 
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      upload: (tag: string, file: File, specification: ZdSpecificationMeta) => api.post<object>('/specification', { file, specification }, {
        query: { tag },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
      update: (tag: string, file: File, specification: ZdSpecificationMeta) => api.put<object>('/specification', { file, specification }, {
        query: { tag },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    system: {
      hash: (filename: string, hash: string) => systemApi.getRaw<ArrayBuffer>(`/${filename}`, { hash }, {
        responseType: 'arrayBuffer'
      }),
      download: (filename: string) => {
        // 使用服务端代理而不是直接调用外部服务
        return api.getRaw<Blob>(`/api/proxy/${filename}`, {}, {
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        })
      },
      upload: (filename: string, file: File) => systemApi.put<object>(`/${filename}`, file, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
      delete: (filename: string) => systemApi.delete<object>(`/${filename}`),
      downloadAsHtml: async (filename: string) => {
        try {
          // filename可能是编码后的完整URL或单纯的文件名
          // 直接使用缓存API进行转换
          const response = await fetch(`/api/cached-docx-to-html/${filename}`)
          
          if (!response.ok) {
            console.error(`文档转换请求失败: ${response.status} ${response.statusText}`)
            throw new Error(`下载并转换文件失败: ${response.statusText}`)
          }
          
          // 获取HTML内容
          const html = await response.text()
          return html
        } catch (error) {
          console.error('下载并转换文件失败:', error)
          throw error
        }
      }
    },

    // 部门 APIs
    dept: {
      getDeptTree: () => api.get('/dept/tree'),
      // 获取部门列表
      getDeptList: (param: any) => api.get<ZdDept[]>('/system/dept/list', param),
      // 获取所属部门列表
      getParentTreeList: () => api.get<ZdDept[]>('/system/dept/parent/list'),
      // 添加部门
      addDept: (param: ZdDept) => api.post<ZdDept>('/system/dept/add', param),
      // 修改部门
      updateDept: (param: ZdDept) => api.put<ZdDept>('/system/dept/update', param),
      // 查询某个部门下是否存在子部门
      getCheckDept: (deptId: number) => api.get(`/system/dept/check/${deptId}`),
      // 删除部门
      deleteDept: (deptId: number) => api.delete<boolean>(`/system/dept/delete/${deptId}`)
   }
  }



} 
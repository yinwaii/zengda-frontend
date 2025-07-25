
import { useApis } from '~/composables/use-apis'

export const useEntityApis = (): any => {
  const api = useApis()
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string || ''
  const dufsServer = config.public.dufsServer as string || ''
  const systemApi = useApis(dufsServer)
  const formApi = useFormApis()

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
      create: (data: Partial<ZdProject>) => api.post<ZdProject>('/project/', data),
      update: (data: Partial<ZdProject>) => api.put<ZdProject>('/project', data),
      delete: (id: number) => api.delete<ZdProject>(`/project/${id}`)
    },

    // Component APIs
    component: {
      getAll: () => api.get<VOList<ZdComponent>>('/component/all'),
      get: (id: number) => api.get<ZdComponent>(`/component/${id}`),
      getByPage: (page: number, size: number) => api.get<VOPaged<ZdComponent>>('/component/', { page, size }),
      create: (data: Partial<ZdComponent>) => api.post<ZdComponent>('/component/', data),
      update: (data: Partial<ZdComponent>) => api.put<ZdComponent>('/component', data),
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
    bom_configuration: {
      get: (configId: number, componentId: number) => api.get<ZdBomConfiguration>(`/configuration/bom/`, {componentId, configId}),
      create: (configId: number, componentId: number, bomId: number) => api.post<ZdBomConfiguration>('/configuration/bom', {configId, tcomponentId: componentId, bomId}),
      update: (configId: number, componentId: number, bomId: number) => api.put<ZdBomConfiguration>('/configuration/bom', {configId, tcomponentId: componentId, bomId}),
      delete: (configId: number, componentId: number, bomId: number) => api.delete<ZdBomConfiguration>('/configuration/bom', {configId, tcomponentId: componentId, bomId}),
    },
    component_configuration: {
      get: (configId: number) => api.get<Array<ZdComponentConfiguration>>(`/configuration/${configId}/component`),
      create: (configId: number, param: ZdComponentConfiguration) => api.post<ZdComponentConfiguration>(`/configuration/${configId}/component`, param),
      update: (configId: number, param: ZdComponentConfiguration) => api.put<ZdComponentConfiguration>(`/configuration/${configId}/component`, param),
      createBatch: (configId: number, param: Array<ZdComponentConfiguration>) => api.post<boolean>(`/configuration/${configId}/component/batch`, param),
      updateBatch: (configId: number, param: Array<ZdComponentConfiguration>) => api.put<boolean>(`/configuration/${configId}/component/batch`, param),
      delete: (configId: number, componentId: number) => api.delete<boolean>(`/configuration/${configId}/component/`, { id: componentId })
    },
    psystem_component: {
      getAll: (psystemId: number) => api.get<Array<number>>(`/pSystem/${psystemId}/components`),
      update: (psystemId: number, componentIds: number[]) => api.put<Array<number>>(`/pSystem/${psystemId}/components`, componentIds,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ),
      delete: (psystemId: number) => api.delete<null>(`/pSystem/${psystemId}/components`)
    },

    price: {
      get: (configId: number) => api.get<ZdPrice>(`/price`, { configId })
    },

    argument: {
      get: (configId: number, objectType: string, objectId: string) => api.get<ZdObjectArgument>(`/argument`, { configId, objectType, objectId }),
      create: (configId: number, argument: ZdObjectArgument) => api.post<ZdObjectArgument>(`/argument`, argument, {
        query: { configId }
      }),
      update: (configId: number, argument: ZdObjectArgument) => api.put<ZdObjectArgument>(`/argument`, argument, {
        query: { configId }
      }),
      updateBatch: (configId: number, used_arguments: Array<ZdObjectArgument>) => api.post<boolean>('/argument/batch', used_arguments, {
        query: { configId }
      }),
      delete: (configId: number) => api.delete<ZdObjectArgument>(`/argument`, { configId })
    },

    configuration: {
      get: (id: number) => api.get<ZdConfiguration>(`/configuration/${id}`),
      getByTemplateId: (templateId: number, projectId: number) => api.get<VOList<ZdConfiguration>>('/configuration/', { tid: templateId, pid: projectId }),
      create: (data: ZdConfiguration) => api.post<ZdConfiguration>('/configuration/', data),
      update: (data: ZdConfiguration) => api.put<ZdConfiguration>('/configuration', data),
      delete: (id: number) => api.delete<ZdConfiguration>(`/configuration/${id}`),
      createDefault: (projectId: number) => api.get<number>(`/configuration/default/project/${projectId}`)
    },

    // Template APIs
    template: {
      get: (id: number) => api.get<ZdTemplate>(`/template/${id}`),
      getByPage: (page: number, size: number) => api.get<VOPaged<ZdTemplate>>('/template/', { page, size }),
      create: (data: Partial<ZdTemplate>) => api.post<ZdTemplate>('/template/', data),
      update: (data: Partial<ZdTemplate>) => api.put<ZdTemplate>('/template', data),
      delete: (id: number) => api.delete<ZdTemplate>(`/template/${id}`),
    },

    template_psystem: {
      getByTemplateId: (templateId: number) => api.get<VOList<ZdPSystem>>(`/template/${templateId}/pSystem`),
      create: (templateId: number, psystemId: number) => api.post<ZdPSystem>(`/template/${templateId}/pSystem/${psystemId}`),
      createBatch: (templateId: number, psystemId: Array<number>) => api.post<boolean>(`/template/${templateId}/pSystem/`, psystemId), 
      update: (templateId: number, psystemId: number) => api.put<ZdPSystem>(`/template/${templateId}/pSystem/${psystemId}`),
      updateBatch: (templateId: number, psystemIds: Array<number>) => api.put<boolean>(`/template/${templateId}/pSystem/`, psystemIds),
      delete: (templateId: number, psystemId: number) => api.delete<ZdPSystem>(`/template/${templateId}/pSystem/${psystemId}`)
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
      create: (data: Partial<ZdPSystem>) => api.post<ZdPSystem>('/pSystem/', data),
      update: (data: Partial<ZdPSystem>) => api.put<ZdPSystem>('/pSystem', data),
      delete: (id: number) => api.delete<ZdPSystem>(`/pSystem/${id}`),
    },

    // Template Component APIs
    template_component: {
      getByTemplateId: (templateId: number) => api.get<VOList<ZdTComponent>>('/tComponent/', { tid: templateId }),
      create: (data: Partial<ZdTComponent>) => api.post<ZdTComponent>('/tComponent/', data),
      createBatch: (data: Array<Partial<ZdTComponent>>) => api.post<boolean>('/tComponent/batch', data),
      update: (data: Partial<ZdTComponent>) => api.put<ZdTComponent>('/tComponent', data),
      updateBatch: (data: Array<Partial<ZdTComponent>>) => api.put<boolean>('/tComponent/batch', data),
      delete: (id: number) => api.delete<ZdTComponent>(`/tComponent/${id}`)
    },

    item: {
      get: (id: string) => api.get<ZdItem>(`/item/${id}`),
      getByPage: (query: ZdItemQuery) => api.post<ZdItemPaged>(`/item`, {}, {
        body: query,
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      search: (searchValue: string, query: ZdItemQueryPage) => api.get<ZdItem[]>(`/item/search?searchValue=${searchValue}`, {
        body: query,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    bom: {
      get: (id: number) => api.get<ZdBom>(`/bom/${id}`),
      getByComponentId: (componentId: number) => api.get<Array<number>>(`/bom/`, { componentId }),
      create: (data: Partial<ZdBom>) => api.post<ZdBom>('/bom', data),
      update: (data: Partial<ZdBom>) => api.put<ZdBom>('/bom', data),
      delete: (id: number) => api.delete<ZdBom>(`/bom/${id}`)
    },

    specification: {
      getAll: (id: number) => api.get<ZdSpecification>(`/specification/tree/${id}`),
      get: (id: number) => api.get<ZdSpecification>(`/specification/${id}`),
      render: (configId: number, body: ZdSpecificationQuery) => api.post<string>('/specification/rendering', body, {
        params: { configId },
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      upload: (tag: string, file: File, specification: ZdSpecificationMeta) => formApi.post<object>('/specification', { file, specification }, {
        query: { tag }
      }),
      update: (tag: string, file: File, specification: ZdSpecificationMeta) => formApi.put<object>('/specification', { file, specification }, {
        query: { tag }
      }),
      modify_psystem: (psystemId: number, formData: FormData) => formApi.put<object>(`/pSystem/${psystemId}/spec`, formData),
      modify_template: (templateId: number, formData: FormData) => formApi.put<object>(`/template/${templateId}/spec`, formData)
    },

    paramMapping: {
      getAll: (specId: number) => api.get<Array<ZdSpecTagMap>>(`/specification/paramMapping/${specId}`),
      update: (specId: number, specMap: ZdSpecTagMap) => api.put<ZdSpecTagMap>(`/specification/paramMapping/${specId}`, specMap),
      delete: (specId: number, specParamName: string) => api.delete<ZdSpecTagMap>(`/specification/paramMapping/${specId}`, {}, {
        query: { specParamName }
      })
    },

    searchParam: {
      search: (searchStr: string) => api.get<ZdSearchParam[]>(`/parameter/search`, { searchValue: searchStr })
    },

    system: {
      hash: (filename: string, hash: string) => systemApi.getRaw<ArrayBuffer>(`/${filename}`, { hash }, {
        responseType: 'arrayBuffer'
      }),
      download: (filename: string, options: { mode?: 'no-cors' } = {}) => {
        // 使用服务端代理而不是直接调用外部服务
        return systemApi.getRaw<Blob>(`/${filename}`, {}, {
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          },
          mode: options.mode || 'cors'
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
          // 确保文件名是正确编码的
          const encodedFilename = encodeURIComponent(filename);
          
          // 直接使用缓存API进行转换
          const response = await fetch(`/api/cached-docx-to-html/${encodedFilename}`)
          
          if (!response.ok) {
            let errorDetail = '';
            try {
              // 尝试读取错误详情
              const errorText = await response.text();
              const errorJson = JSON.parse(errorText);
              errorDetail = errorJson.message || response.statusText;
            } catch (e) {
              errorDetail = response.statusText;
            }
            
            console.error(`文档转换请求失败: ${response.status} ${errorDetail}`)
            throw new Error(`下载并转换文件失败: ${errorDetail}`)
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
   },


   // userinfo
   userinfo: {
      getUserPage: (param: any) => api.post('/system/user/page', param),
      addUser: (user: User) => api.post<User>('/system/user/add', user),
      updateUser: (user: User) => api.put<User>('/system/user/update', user),
      deleteUser: (id: number) => api.delete<User>(`/system/user/delete/${id}`),
   //获取分配角色列表数据
      getRoleIdByUserId: (userId: number) => api.get(`/system/user/getRoleByUserId/${userId}`),

      //用户分配角色
      assignRoleSave: (params: {userId: number, roleIds: number[]}) => api.post("/system/user/saveUserRole", params)
    },

    role: {
      getRolePage: (param: any) => api.post('/system/role/page', param),
      addRole: (role: Role) => api.post<Role>('/system/role/add', role),
      updateRole: (role: Role) => api.put<Role>('/system/role/update', role),
      deleteRole: (id: number) => api.delete<Role>(`/system/role/delete/${id}`),
      getCheckRole: (roleId: number) => api.get(`/system/role/getCheckRole/${roleId}`), // 用于删除前检查角色是否已被使用
      getAssignMenuTree: (roleId: number) => api.get<{checkList: number[], menuList: Menu[]}>(`/system/menu/getAssignMenuTree/${roleId}`), // 分配权限，查询权限树数据
      saveRoleAssign: (param: {roleId: number, list: number[]}) => api.post("/system/role/saveRoleAssign", param)
    },

    menu: {
      getMenuById: (id: number) => api.get<Menu>(`/system/menu/${id}`),
      addMenu: (menu: Menu) => api.post<Menu>('/system/menu/add', menu),
      check: (id: number) => api.get(`/system/menu/check/${id}`),
      deleteMenu: (id: number) => api.delete<Menu>(`/system/menu/delete/${id}`),
      updateMenu: (menu: Menu) => api.put<Menu>('/system/menu/update', menu),
      
      getMenuList: () => api.get<Menu[]>('/system/menu/list'), // 查询菜单列表
      getParentList: () => api.get<Menu[]>('/system/menu/parent/list'), // 查询上级菜单列表
    }
  }
} 

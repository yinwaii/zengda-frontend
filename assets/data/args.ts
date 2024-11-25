export interface Argument {
	id: number
	name: string
	type: string
	default?: string
	template?: string
	isEnabled: boolean
	isEditable: boolean
	children?: Argument[]
	isEditing?: boolean
	parent: number
}

export const typeOptions = ['number', 'string', 'boolean', 'struct', 'enum', 'object', 'file']

export const rootArgument: Argument = {
	"id": -1,
	"name": "root",
	"type": "none",
	"template": String.raw``,
	"isEnabled": true,
	"isEditable": false,
	"parent": -1,
	"children": [
		{
			"id": 0,
			"name": "设备名称",
			"type": "string",
			"template": String.raw``,
			"isEnabled": true,
			"isEditable": true,
			"default": "WDAZ",
			"parent": -1
		},
		{
			"id": 1,
			"name": "型号",
			"type": "string",
			"template": String.raw``,
			"isEnabled": true,
			"isEditable": true,
			"default": "",
			"parent": -1
		},
		{
			"id": 2,
			"name": "有效容积",
			"type": "number",
			"template": String.raw``,
			"isEnabled": true,
			"isEditable": true,
			"default": "",
			"parent": -1
		},
		{
			"id": 3,
			"name": "内部尺寸",
			"type": "struct",
			"template": String.raw``,
			"isEnabled": true,
			"isEditable": true,
			"default": "",
			"parent": -1,
			"children": [
				{
					"id": 4,
					"name": "宽",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 3
				},
				{
					"id": 5,
					"name": "深",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 3
				},
				{
					"id": 6,
					"name": "高",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 3
				},
			]
		},
		{
			"id": 7,
			"name": "外部尺寸",
			"type": "struct",
			"template": String.raw``,
			"isEnabled": true,
			"isEditable": true,
			"default": "",
			"parent": -1,
			"children": [
				{
					"id": 8,
					"name": "宽",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 7
				},
				{
					"id": 9,
					"name": "深",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 7
				},
				{
					"id": 10,
					"name": "高",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 7
				},
			]
		},
		{
			"id": 11,
			"name": "温度性能",
			"type": "object",
			"template": String.raw``,
			"isEnabled": true,
			"isEditable": true,
			"default": "",
			"parent": -1,
			"children": [
				{
					"id": 12,
					"name": "无光照温度范围",
					"type": "pair",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 11
				},
				{
					"id": 13,
					"name": "有光照温度范围",
					"type": "pair",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 11
				},
				{
					"id": 14,
					"name": "温度波动度",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 11
				},
				{
					"id": 15,
					"name": "温度均匀度",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 11
				},
				{
					"id": 16,
					"name": "温度偏差",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 11
				},
			]
		},
		{
			"id": 17,
			"name": "湿度性能",
			"type": "object",
			"template": String.raw``,
			"isEnabled": true,
			"isEditable": true,
			"default": "",
			"parent": -1,
			"children": [
				{
					"id": 18,
					"name": "无光照",
					"type": "object",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 17,
					"children": [
						{
							"id": 19,
							"name": "湿度范围",
							"type": "pair",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 18
						},
						{
							"id": 20,
							"name": "在环境温度范围",
							"type": "pair",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 18
						},
						{
							"id": 21,
							"name": "露点温度范围",
							"type": "pair",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 18
						},
					]
				},
				{
					"id": 22,
					"name": "有光照",
					"type": "object",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 17,
					"children": [
						{
							"id": 23,
							"name": "湿度范围",
							"type": "pair",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 22
						},
						{
							"id": 24,
							"name": "在环境温度范围",
							"type": "pair",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 22
						},
						{
							"id": 25,
							"name": "露点温度范围",
							"type": "pair",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 22
						},
					]
				},
				{
					"id": 26,
					"name": "湿度波动度",
					"type": "pair",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 17
				},
				{
					"id": 27,
					"name": "湿度偏差",
					"type": "struct",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 17,
					"children": [
						{
							"id": 28,
							"name": "界限",
							"type": "number",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 27
						},
						{
							"id": 29,
							"name": "大于界限",
							"type": "number",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 27
						},
						{
							"id": 30,
							"name": "小于界限",
							"type": "number",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 27
						},
					]
				},
			]
		},
		{
			"id": 31,
			"name": "温度变化速率",
			"type": "object",
			"template": String.raw``,
			"isEnabled": true,
			"isEditable": true,
			"default": "",
			"parent": -1,
			"children": [
				{
					"id": 32,
					"name": "升温范围",
					"type": "pair",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 31
				},
				{
					"id": 33,
					"name": "平均速率",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 31
				},
				{
					"id": 34,
					"name": "降温范围",
					"type": "pair",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 31
				},
				{
					"id": 35,
					"name": "平均速率",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 31
				},
			]
		},
		{
			"id": 36,
			"name": "阳光模拟性能指标",
			"type": "object",
			"template": String.raw``,
			"isEnabled": true,
			"isEditable": true,
			"default": "",
			"parent": -1,
			"children": [
				{
					"id": 37,
					"name": "频谱分布",
					"type": "file",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 36
				},
				{
					"id": 38,
					"name": "辐照范面积",
					"type": "struct",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 36,
					"children": [
						{
							"id": 39,
							"name": "长",
							"type": "number",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 38
						},
						{
							"id": 40,
							"name": "宽",
							"type": "number",
							"template": String.raw``,
							"isEnabled": true,
							"isEditable": true,
							"default": "",
							"parent": 38
						},
					]
				},
				{
					"id": 41,
					"name": "辐照强度",
					"type": "pair",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 36
				},
				{
					"id": 42,
					"name": "辐照基准平面",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 36
				},
				{
					"id": 43,
					"name": "辐照均匀度",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 36
				},
				{
					"id": 44,
					"name": "最高黑标温度",
					"type": "number",
					"template": String.raw``,
					"isEnabled": true,
					"isEditable": true,
					"default": "",
					"parent": 36
				}
			]
		},
	]
}
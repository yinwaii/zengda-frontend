export interface ZdPSystem extends BasicProperty, TimeStamp {
	isShow: boolean; // 是否可见
	isDeleted: boolean; // 是否已删除
	docsUrl: null | string; // 文档链接
	parentId: number; // 父ID
	specId: number | null; // 规格ID
	children: Array<ZdPSystem> | null; // 子系统
	parameters: Array<ZdParameter> | null; // 参数
}

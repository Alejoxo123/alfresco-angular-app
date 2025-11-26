
export interface AlfrescoNode {
    id: string;
    name: string;
    nodeType: string;
    isFile?: boolean;
    isFolder?: boolean;
    createdAt?: string;
    modifiedAt?: string;
}

export interface AlfrescoNodeEntry {
    entry: AlfrescoNode;
}

export interface AlfrescoPagination {
    count: number;
    hasMoreItems: boolean;
    totalItems: number;
    skipCount: number;
    maxItems: number;
}

export interface AlfrescoChildrenResponse {
    list: {
        entries: AlfrescoNodeEntry[];
        pagination: AlfrescoPagination;
    };
}

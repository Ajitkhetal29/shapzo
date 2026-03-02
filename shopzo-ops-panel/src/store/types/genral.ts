export type Department = {
    _id: string;
    name: string;
    description?: string;
    code?: string;
};
export type Role = {
    _id: string;
    name: string;
    description?: string;
    code?: string;
    department?: {
        _id: string;
        name: string;
    };
};



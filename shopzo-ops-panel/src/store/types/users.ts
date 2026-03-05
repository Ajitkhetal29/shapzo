type Department = {
    _id: string;
    name: string;

};

type Role = {
    _id: string;
    name: string;
    level : number;
};

export type User = {
    _id: string;
    name: string;
    email: string;
    department: Department ; // Can be object or string for backward compatibility
    role: Role ; // Can be object or string for backward compatibility
    createdAt: string;
    updatedAt: string;
    level: number; // Added level to User type
}
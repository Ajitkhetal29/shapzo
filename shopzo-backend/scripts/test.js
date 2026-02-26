import User from "../models/user.js";

import Department from "../models/department.js";
import Role from "../models/role.js";

const createDepartment = async (name, description)=>{
    const department = await Department.create({
        name,
        description,
    });
    console.log("Department created successfully");
    return department;
}

const createRole = async (name, departmentId)=>{
    const department = await Department.findById(departmentId);
    if(!department){
        console.log("Department not found");
        return;
    }
    
    const alreadyexst = await Role.findOne({ name, department: departmentId });
    if(alreadyexst){
            console.log("Role already exists");
        return alreadyexst;
    }
    const role = await Role.create({ name, department: departmentId });
    console.log("Role created successfully");
    return role._id;
}

const createUser = async (name, email, password, departmentId, roleId)=>{
    const department = await Department.findById(departmentId);
    if(!department){
        console.log("Department not found");
        return;
    }
    const role = await Role.findById(roleId);
    if(!role){
}
    const user = await User.create({ name, email, password, department: departmentId, role: roleId });
    console.log("User created successfully");
    return user._id;
}

export { createDepartment, createRole, createUser };

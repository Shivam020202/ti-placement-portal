const { Admin, User, SuperAdmin } = require("../../models");
const excelJs = require('exceljs');
const { all } = require("../../routes");

async function GetAllAdmins(req, res, next) {

    try {
        const admins = await Admin.findAll({
            include: User
        })
        const superAdmins = await SuperAdmin.findAll({
            include: User
        });

        res.status(200).json({
            admins,
            superAdmins
        })
    } catch (error) {
        next(error);
    }
}


async function GetAdmin(req, res, next) {

    const email = req.params.id;
    try {

        const user = await User.findByPk(email, {
            include: Admin
        });

        if (!user)
            throw new Error("Admin Doesn't Exists");

        res.status(200).json({
            user
        })
    } catch (error) {
        next(error);
    }
}



async function UpdateAdminDetails(req, res, next) {

    const { userEmail, updatedValues } = req.body;
    try {

        const updatedAdmin = await Admin.update(
            { ...updatedValues },
            { where: { user: userEmail } }
        );

        if (!updatedAdmin)
            throw new Error("Admin doesn't exists")

        res.status(200).json({
            updatedAdmin
        })
    } catch (error) {
        next(error);
    }
}


async function DeleteAdmin(req, res, next) {

    const adminEmail = req.params.adminEmail;

    try {

        const deletedUser = await User.destroy({
            where: { email: adminEmail }
        });

        // const deletedAdmin = await Admin.destroy({
        //     where: { user: adminEmail }
        // });

        if (!deletedUser) {
            throw new Error("User Doesn't Exists");
        }

        res.status(200).json({
            deletedUser
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const ExtractAdminData = async (req, res, next) => {
    try {
        let workbook = new excelJs.Workbook();
        const sheet = workbook.addWorksheet('Admins and Super Admins');

        sheet.columns = [
            { header: "Name", key: "name", width: 30 },
            { header: "Designation", key: "designation", width: 20 },
            { header: "Added By", key: "addedBy", width: 30 },
            { header: "Date Added", key: "dateAdded", width: 20 },
            { header: "Last Login", key: "lastLogin", width: 20 }
        ];

        let admins = await Admin.findAll({
            include: [{
                model: User,
                attributes: ['firstName', 'lastName', 'role', 'addedBy', 'createdAt', 'updatedAt']
            }]
        });

        let superAdmins = await SuperAdmin.findAll({
            include: [{
                model: User,
                attributes: ['firstName', 'lastName', 'role', 'addedBy', 'createdAt', 'updatedAt']
            }]
        });

        let data = [...admins, ...superAdmins].map(record => ({
            name: `${record.User.firstName} ${record.User.lastName}`,
            designation: record.User.role,
            addedBy: record.User.addedBy,
            dateAdded: record.User.createdAt,
            lastLogin: record.User.updatedAt
        }));

        sheet.addRows(data);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=admins_and_super_admins.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        next(error);
    }
};


module.exports = {
    GetAdmin,
    GetAllAdmins,
    UpdateAdminDetails,
    DeleteAdmin,
    ExtractAdminData
}
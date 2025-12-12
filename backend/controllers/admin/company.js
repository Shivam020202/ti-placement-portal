const {Company} = require("../../models");
const {HttpError, HttpCodes, respond} = require("../../config/http");
const Sequelize = require("sequelize");


const createCompany = async (req, res, next) => {
    const data = req.body;
    // console.log('received data:- ',data);
    
    try {

       
        if (!req.files && !req.files['logo']){
            throw new HttpError(
                HttpCodes.BAD_REQUEST,
                "logo not found",
                Error().stack
            );
        }
        //  when file is uploaded
        const logoPath =`/uploads/logo/${req.files['logo'][0].filename}`;
        data.logo = logoPath;
        // console.log( 'path name:-------',logoPath)
        const [company, created] = await Company.findOrCreate({
          where: { name: data.name },
          defaults: {
            ...data
          }
        });
    
        if (!created) {
          throw new HttpError(HttpCodes.CONFLICT, "Company already exists", Error().stack);
        }
        // console.log(data)
        // console.log(logoPath)
        respond(res, HttpCodes.CREATED, "Company created", company);

    } catch (error) {
        next(error);
    }
};

const deleteCompanyById = async (req, res, next) => {
    const companyId = req.params.id;

    try {
        const deletedCompany = await Company.destroy({
            where: { id: companyId }
        })

        if (!deletedCompany) {
            throw new HttpError(HttpCodes.NOT_FOUND, "Company not found", Error().stack);
        }

        respond(res, HttpCodes.OK, "Company deleted", deletedCompany);
    } catch (error) {
        next(error);
    }
}

const getAllCompanies = async (req, res, next) => {
    const toShowBlacklisted = req.query.showBlacklisted || false;
    try {
        const companies = await Company.findAll({
            where: { isBlacklisted: toShowBlacklisted }
        })

        if (!companies.length) {
            throw new HttpError(HttpCodes.NOT_FOUND, "No Companies found", Error().stack);
        }

        respond(res, HttpCodes.OK, "Companies found", companies);
    } catch (error) {
        next(error);
    }
}

const getCompanyById = async (req, res, next) => {
    const companyId = req.params.id;
    try {
        const company = await Company.findByPk(companyId);

        if (!company) {
            throw new HttpError(HttpCodes.NOT_FOUND, "Company not found", Error().stack);
        }

        respond(res, HttpCodes.OK, "Company found", company);
    } catch (error) {
        next(error);
    }
}

const getCompanyByName = async (req, res, next) => {
    const name = req.body.name;
    try {
        const company = await Company.findOne({
            where: { 
                name: {
                    [Sequelize.Op.iLike]: `${name}`
                }
            }
        });

        if (!company) {
            throw new HttpError(HttpCodes.NOT_FOUND, "Company not found", Error().stack);
        }

        respond(res, HttpCodes.OK, "Company found", company);
    } catch (error) {
        next(error);
    }
}

const updateCompanyById = async (req, res, next) => {
    const companyId = req.params.id;
    const { updatedData } = req.body;

    try {
        const updatedCompany = await Company.update(updatedData, {
            where: { id: companyId }
        });

        if (!updatedCompany) {
            throw new HttpError(HttpCodes.NOT_FOUND, "Company not found", Error().stack);
        }

        respond(res, HttpCodes.OK, "Company updated", updatedCompany);
    } catch (error) {
        next(error);
    }
}

const searchCompaniesByName = async (req, res, next) => {
    const name = req.query.name;
    try {
        const companies = await Company.findAll({
            where: {
                name: {
                    [Sequelize.Op.iLike]: `%${name}%`
                }
            }
        });

        if (!companies.length) {
            throw new HttpError(HttpCodes.NOT_FOUND, "No Companies found", Error().stack);
        }

        respond(res, HttpCodes.OK, "Companies found", companies);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createCompany,
    deleteCompanyById,
    getAllCompanies,
    getCompanyByName,
    getCompanyById,
    searchCompaniesByName,
    updateCompanyById
}
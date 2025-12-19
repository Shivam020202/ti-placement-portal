const { sequelize, JobListing } = require("./models");

(async () => {
  try {
    console.log("Associations:");
    console.log(Object.keys(JobListing.associations));
  } catch (e) {
    console.error(e);
  } finally {
    await sequelize.close();
  }
})();

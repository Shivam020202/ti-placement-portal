const {
  sequelize,
  JobListing,
  ListingReview,
  User,
  Company,
} = require("./models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established.");

    console.log(
      "JobListing Associations:",
      Object.keys(JobListing.associations)
    );

    const jobs = await JobListing.findAll({
      include: [
        {
          model: ListingReview,
          as: "Review",
        },
        {
          model: User,
        },
        {
          model: Company,
        },
      ],
    });

    console.log(`Found ${jobs.length} jobs.`);
    jobs.forEach((job) => {
      console.log(
        `Job ID: ${job.id}, Title: ${job.title}, AddedBy: ${
          job.addedBy
        }, User: ${job.User ? job.User.email : "NULL"}, Review: ${
          job.Review ? job.Review.status : "NULL"
        }`
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
})();

const models = require("./models");
console.log("User:", models.User ? "Found" : "Missing");
console.log("JobListing:", models.JobListing ? "Found" : "Missing");
console.log("ListingReview:", models.ListingReview ? "Found" : "Missing");
console.log("Company:", models.Company ? "Found" : "Missing");

/**
 * Seed script to create a student account for testing
 * Run with: node seed_student.js
 */

const { User, Student, Branch, sequelize } = require("./models");

async function seedStudent() {
  try {
    // Wait for database connection
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Sync models (this will ensure tables exist)
    await sequelize.sync();
    console.log("Database synchronized.");

    // First, ensure we have a branch (CSE as default)
    let branch = await Branch.findByPk("CSE");
    if (!branch) {
      branch = await Branch.create({
        code: "CSE",
        name: "Computer Science and Engineering",
      });
      console.log("Created branch: CSE");
    }

    const email = "shivam.gem222@gmail.com";

    // Check if user already exists
    let user = await User.findByPk(email);
    if (user) {
      console.log(
        `User ${email} already exists. Checking if student record exists...`
      );

      // Check if student record exists
      const existingStudent = await Student.findOne({ where: { user: email } });
      if (existingStudent) {
        console.log(
          "Student record already exists:",
          existingStudent.rollNumber
        );
        process.exit(0);
      }
    } else {
      // Create the user
      user = await User.create({
        email: email,
        firstName: "Shivam",
        lastName: "Sharma",
        role: "student",
      });
      console.log("Created user:", user.email);
    }

    // Create the student record
    const student = await Student.create({
      rollNumber: "102203222",
      gradYear: 2026,
      program: "ug",
      course: "btech",
      cgpa: 8.5,
      subjectsFailed: 0,
      class10ScoreType: "percentage",
      class10Score: 92.5,
      class10Board: "CBSE",
      class12ScoreType: "percentage",
      class12Score: 88.0,
      class12Board: "CBSE",
      dateOfBirth: "2003-01-15",
      isPlaced: false,
      isSpr: false,
      isSic: false,
      branchCode: "CSE",
      user: email,
    });

    console.log("✅ Student account created successfully!");
    console.log("");
    console.log("Account Details:");
    console.log("================");
    console.log(`Email: ${email}`);
    console.log(`Name: Shivam Sharma`);
    console.log(`Roll Number: ${student.rollNumber}`);
    console.log(`Branch: CSE (Computer Science and Engineering)`);
    console.log(`CGPA: ${student.cgpa}`);
    console.log(`Graduation Year: ${student.gradYear}`);
    console.log("");
    console.log("You can now login with Google using this email.");

    process.exit(0);
  } catch (error) {
    console.error("Error creating student account:", error);
    process.exit(1);
  }
}

seedStudent();

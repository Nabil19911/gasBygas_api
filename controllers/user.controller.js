import User from "../models/user.model.js";

/**
 * Get user profile by email
 * @param {Request} req
 * @param {Response} res
 */
export const getUserProfile = async (req, res) => {
  const { email } = req.body;

  try {
    const customer = await User.findOne({ email }).select("-password");

    if (!customer) {
      throw new Error("User not found");
    }

    const organizationData = {
      ...customer._doc,
      role: customer.created_by,
      password: undefined,
    };

    res.status(200).send({ data: organizationData });
  } catch (error) {
    console.error("Error fetching user profile: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

/**
 * Get All users
 * @param {Request} req
 * @param {Response} res
 */
export const getAllUsers = async (req, res) => {
  try {
    const customers = await User.find().select("-password");

    if (!customers) {
      throw new Error("Customers are not found");
    }

    res.status(200).send({ data: customers });
  } catch (error) {
    console.error("Error fetching customers: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

/**
 * Create new user
 * @param {Request} req
 * @param {Response} res
 */
export const createNewUser = async (req, res) => {
  try {
    const existingRecord = await User.findOne({ email });

    if (existingRecord) {
      throw new Error("Email already taken");
    }

    const saltRounds = 10;
    const generatePassword = generateToken(10);
    const hashedPassword = await bcrypt.hash(generatePassword, saltRounds);

    const data = {
      ...req.body,
      password: hashedPassword,
    };

    const employee = await User(data);
    const respond = await employee.save();

    if (!employee) {
      throw new Error("Employee is not created");
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(
      __dirname,
      "..",
      "emailTemplates",
      "employeeRegister.ejs"
    );
    const emailHtml = await ejs.renderFile(templatePath, {
      password: generatePassword,
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Welcome to the Team!",
      html: emailHtml,
    };

    const transporter = await mailer(mailOptions);

    const emailRespond = await transporter.sendMail(mailOptions);

    res
      .status(201)
      .send({ data: { password: generatePassword, respond, emailRespond } });
  } catch (error) {
    console.error("Error creating customers: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

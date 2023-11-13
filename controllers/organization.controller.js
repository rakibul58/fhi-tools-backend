const { ObjectId } = require("mongodb");
const client = require("../utils/dbConnect");
const organizationCollection = client.db('fhi-tool').collection('organizations');

module.exports.addAOrganization = async (req, res, next) => {
    try {
        const data = req.body;
        const { email } = data;
        const existingOrganization = await organizationCollection.findOne({ email });

        if (existingOrganization) {
            return res.send({ success: false, message: "A Organization has already signed up with this email" })
        }

        const result = await organizationCollection.insertOne(data);

        res.send({ success: true, result });

    } catch (error) {
        res.send({ success: false, message: "Something went wrong" });
    }
};


module.exports.getUserByEmail = async (req, res, next) => {
    try {

        const email = req.query.email;
        const result = await organizationCollection.findOne({ email });
        res.send({ success: true, result });

    } catch (error) {
        res.send({ success: false, message: "Something went wrong" });
    }
}


module.exports.updateOrganization = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await organizationCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );

        res.send({ success: true, result });

    } catch (error) {
        console.log(error);
        res.send({ success: false, message: "Something went wrong", error });
    }
}


module.exports.postFinancialData = async (req, res, next) => {
    try {
        const { email, financialData } = req.body;

        console.log(email);

        // Check if email and financialData are provided
        if (!email || !financialData) {
            return res.send({ success: false, message: 'Email and financialData are required.', error });
        }

        // Find the organization by email
        const organization = await organizationCollection.findOne({ email });

        // If organization not found, return error
        if (!organization) {
            return res.send({ success: false, message: 'Organization not found.', error });
        }

        // Extract monthYear from the incoming financial data
        const incomingMonthYear = financialData.monthYear;

        // Check if the organization has a financialData array
        if (!organization.financialData) {
            // If not, create the financialData array
            organization.financialData = [];
        } else {
            // Check if the monthYear already exists in the financialData array
            const existingData = organization.financialData.find((data) => data.monthYear === incomingMonthYear);

            if (existingData) {
                // If exists, return a message indicating that the data already exists
                return res.send({
                    success: false,
                    message: `Data for ${incomingMonthYear} already exists.`,
                    error
                });
            }
        }

        // Push the new financial data into the array
        organization.financialData.push(financialData);

        // Update the organization in the database
        const result = await organizationCollection.updateOne({ email }, { $set: organization });

        // Return success message
        res.send({ success: true, result });
    } catch (error) {
        console.error(error);
        return res.send({ success: false, message: 'Something went wrong', error });
    }
}
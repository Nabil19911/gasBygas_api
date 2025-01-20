/**
 * Create new user
 * @param {Request} req
 * @param {Response} res
 */
export const createNewGasRequest = async (req, res) => {
  try {
    console.log(req.body);
    res.status(201).send({ data: {} });
  } catch (error) {
    console.error("Error creating customers: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

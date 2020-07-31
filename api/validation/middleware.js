module.exports = (schema, property) => (req, res, next) => {
  const { error } = schema.validate(req[property]);

  if (error !== null && error !== undefined) {
    const { details } = error;
    res.status(400).json({ errors: details.map(({ message }) => message) });
  } else {
    next();
  }
};

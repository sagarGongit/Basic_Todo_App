const RoleBaseAuthMiddleware = async (req, res, next) => {
  const role = req.body.role;
  try {
    if (role != "admin") {
      res.status(501).json({
        message: "access dennied you are not authorized",
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "internal server error while role base authentication",
    });
  }
};

module.exports = RoleBaseAuthMiddleware;

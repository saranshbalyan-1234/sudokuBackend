const getError = (e, res, tokenType) => {
  console.log(e);
  let message = "";
  if (
    e.errors &&
    (e.name == "SequelizeValidationError" ||
      e.name == "SequelizeUniqueConstraintError")
  ) {
    e.errors.forEach((error) => {
      switch (error.validatorKey) {
        case "equals":
          message = `Invalid ${error.path}`;
          break;
        case "isIn":
          message = `Invalid ${error.path}`;
          break;
        case "not_unique":
          message = `Duplicate ${error.path} entry`;
          break;
        case "len":
          message = `${error.path} must conatin between ${error.validatorArgs[0]} and ${error.validatorArgs[1]} characters`;
          break;
        case "is_null":
          message = `${error.path} cannot be null`;
          break;
        case "isEmail":
          message = `${error.path} is not a valid Email Address`;
          break;
        case 'isDate':
          message = `${error.path} is not a valid Date`;
          break;
        case 'isInt':
          message = `Invalid ${error.path} is not a valid Integer`;
          break;
        case 'min':
          message = `${error.path} must be >= ` + error.validatorArgs[0];
          break;
        case 'max':
          message = `${error.path} must be <= ` + error.validatorArgs[0];
          break;
        default:
          message = "Something Went Wrong";
      }
    });
    return res.status(400).json({ error: message });
  } else if (e.name == "SequelizeDatabaseError") {
    message = e.parent.sqlMessage;
    return res.status(500).json({ error: message });
  } else if (e.name == "SequelizeEagerLoadingError") {
    message = "Association Error, Please Check Backend";
    return res.status(500).json({ error: message });
  } else if (e.message) {
    let code = 400;
    switch (e.name) {
      case "TokenExpiredError":
        message = `${tokenType || "Access"} Token Expired`;
        code = 403;
        break;
      case "JsonWebTokenError":
        message = `Invalid ${tokenType || "Access"} Token`;
        code = 401;
        break;
      case "SequelizeForeignKeyConstraintError":
        function singularize(word) {
          const endings = {
            ves: 'fe',
            ies: 'y',
            i: 'us',
            zes: 'ze',
            ses: 's',
            es: 'e',
            s: ''
          };
          return word.replace(
            new RegExp(`(${Object.keys(endings).join('|')})$`),
            r => endings[r]
          );
        }
        let forKey = e.message.split("`")?.[3]

        if (forKey) {
          forKey = singularize(forKey)
          message = `Already used in some ${forKey}`;
        } else {
          message = e.message;
        }

        break;
      default:
        message = e.message;
    }
    return res.status(code).json({ error: message });
  } else {
    return res.status(500).json(e);
  }
};

export default getError;

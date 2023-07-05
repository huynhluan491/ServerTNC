const UserDAO = require("../DAO/UserDAO");

exports.getUserById = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const user = await UserDAO.getUserById(id);
    if (!user) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Not found user with Id ${id}!`,
        });
    }
    req.user = user;
    return res.status(200).json({
      code: 200,
      msg: null,
      data: user,
    });
  } catch (e) {
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.getUsers = async (req, res) => {
  const users = await UserDAO.getAllUsers(req.query);
  res.status(200).json({
    code: 200,
    msg: "OK",
    data: {
      users,
    },
  });
};

// exports.getUser = async (req, res) => {
//   try {
//     const user = req.user;
//     res.status(200).json({
//       code: 200,
//       msg: "OK",
//       data: { user },
//     });
//   } catch (e) {
//     console.error(e);
//     res
//       .status(500) // 500 - Internal Error
//       .json({
//         code: 500,
//         msg: e.toString(),
//       });
//   }
// };

exports.getUserByUserName = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await UserDAO.getUserByUserName(username);
    if (!user) {
      return res
        .status(404) /// 404 - NOT FOUND!
        .json({
          code: 404,
          msg: `Not found user with name ${username}`,
        });
    }
    res.status(200).json({
      code: 200,
      msg: null,
      data: user ,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.addUser = async (req, res) => {
  const newUser = req.body;
  try {
    let user = await UserDAO.getUserByEmail(req.body.email);
    if (user) {
      // console.log(user);
      return res.status(403).json({
        code: 403,
        msg: "User email used!",
      });
    }
    user = await UserDAO.getUserByUserName(req.body.userName);
    if (user) {
      // console.log(user);
      return res.status(403).json({
        code: 403,
        msg: "User name used!",
      });
    }
    const result = await UserDAO.insertUser(newUser);
    const u = await UserDAO.getUserByUserName(newUser.userName);
    await CartDAO.createNewCart(u.userID);
    return res.status(200).json({
      code: 200,
      msg: null,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      code: 404,
      msg: "Add user failed!",
    });
  }
};

exports.updateUserById = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const updateInfo = req.body;
    let user = await UserDAO.getUserById(id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        msg: `Not found user with Id ${id}!`,
      });
    }
    await UserDAO.updateUserById(id, updateInfo);
    user = await UserDAO.getUserById(id);
    return res.status(200).json({
      code: 200,
      msg: null,
      data: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: `Update user with id: ${id} failed!`,
    });
  }
};

exports.deleteUserById = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const user = await UserDAO.getUserById(id);
    if (!user) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `User with Id ${id} not found!`,
        });
    }
    if (user.auth === 1) {
      return res
        .status(403) //NOT FOUND
        .json({
          code: 403,
          msg: `Cannot delete admin account!`,
        });
    }
    await UserDAO.deleteUserById(id);
    return res.status(200).json({
      code: 200,
      msg: `Deleted user with id ${id} successfully!`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.deleteMultipleUserById = async (req, res) => {
  const idList = req.query.id;
  try {
    if (!idList || idList.length === 0) {
      return res.status(403).json({
        code: 403,
        msg: `Invalid ids`,
      });
    }
    await UserDAO.deleteMultipleUserById(idList);
    return res.status(200).json({
      code: 200,
      msg: null,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: `Delete users with id ${idList} failed!`,
    });
  }
};

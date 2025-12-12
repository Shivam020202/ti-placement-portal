const { Op } = require("sequelize");
const { getRedisClient } = require("../../config/redis");
const { User } = require("../../models");

async function getUserMetaData(req, res, next) {
  const email = req.params.email;
  try {
    const redis = await getRedisClient();

    let userMetaData = await redis.get(email);
    if (userMetaData)
      return res.status(200).json({
        user: JSON.parse(userMetaData),
      });

    userMetaData = await User.findByPk(email);
    if (!userMetaData) throw new Error("Incorrect User Email");

    await redis.set(email, JSON.stringify(userMetaData), {
      EX: 3600 * 3,
    });

    res.status(200).json({
      user: userMetaData,
    });
  } catch (error) {
    next(error);
  }
}

async function getUsersMetaData(req, res, next) {
  const { emails } = req.query;
  console.log(emails);
  try {
    const redis = await getRedisClient();

    const usersMetaData = await Promise.all(
      emails.map(async (email) => {
        let userMetaData = await redis.get(email);
        if (userMetaData)
          return {
            user: JSON.parse(userMetaData),
            addedBy: email,
          };

        userMetaData = await User.findByPk(email);
        if (!userMetaData) throw new Error("Incorrect User Email");

        await redis.set(email, JSON.stringify(userMetaData), {
          EX: 3600 * 3,
        });
        return {
          user: userMetaData,
          addedBy: email,
        };
      }),
    );

    res.status(200).json({
      users: usersMetaData,
    });
  } catch (error) {
    next(error);
  }
}

async function getRelatedUsersMetaData(req, res, next) {
  const { slug } = req.params;
  try {
    relatedUsers = await User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${slug}%` } },
          { email: { [Op.like]: `%${slug}%` } },
        ],
        role : {
          [Op.or] : ['super-admin' , 'admin']
        }
      },
      limit: 5,
    });

    console.log(relatedUsers);

    res.status(200).json({
      users: relatedUsers,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserMetaData,
  getUsersMetaData,
  getRelatedUsersMetaData,
};

module.exports = (sequelize, DataTypes) => {
  const Prop = sequelize.define('Prop', {
    body: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return Prop;
};

module.exports = (sequelize, DataTypes) => {
  const Prop = sequelize.define('Prop', {
    body: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        Prop.belongsTo(models.User);
      },
    },
  });
  return Prop;
};

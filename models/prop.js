module.exports = (sequelize, DataTypes) => {
  const Prop = sequelize.define('Prop', {
    body: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        Prop.belongsTo(models.User);
        Prop.belongsToMany(models.User, { through: 'UsersPropsed', as: 'propsed' });
      },
    },
  });
  return Prop;
};

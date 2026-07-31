"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Comments", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("Comments", "articleId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Articles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addIndex("Comments", ["userId"]);
    await queryInterface.addIndex("Comments", ["articleId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Comments", ["articleId"]);
    await queryInterface.removeIndex("Comments", ["userId"]);

    await queryInterface.removeColumn("Comments", "articleId");
    await queryInterface.removeColumn("Comments", "userId");
  },
};

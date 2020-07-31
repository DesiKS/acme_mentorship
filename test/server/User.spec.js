const { expect } = require('chai');
const {
  db,
  models: { User },
} = require('../../server/db');

/**
 * You'll have to configure the User model to have a name field and a
 * userType field. You'll also be asked to create two virtual fields,
 * isTeacher and isStudent.
 */

describe('Model: User', () => {
  let users;

  beforeEach(async () => {
    await db.sync({ force: true });
    const _users = await Promise.all([
      User.create({ name: 'MOE' }),
      User.create({ name: 'LUCY', userType: 'TEACHER' }),
      User.create({ name: 'WANDA' }),
      User.create({ name: 'EDDY' }),
    ]);
    const [moe, lucy] = _users;
    await moe.setMentor(lucy);
    users = _users.reduce((acc, user) => {
      acc[user.name] = user;
      return acc;
    }, {});
  });
  it('there are 4 users seeded', () => {
    expect(Object.entries(users).length).to.equal(4);
  });
  xit('lucy is moes mentor', () => {
    expect(users.MOE.mentorId).to.equal(users.LUCY.id);
  });

  describe('creating', () => {
    describe('when name is not unique', () => {
      xit('can not be create', async () => {
        try {
          await User.create({ name: 'LUCY' });
          throw Error('noooo');
        } catch (ex) {
          expect(ex.errors[0].path).to.equal('name');
        }
      });
    });
    describe('when a mentor is not a TEACHER', () => {
      xit('can NOT be created', async () => {
        const eddy = users.EDDY;
        try {
          await User.create({ name: 'JERRY', mentorId: eddy.id });
          throw Error('noooo');
        } catch (ex) {
          expect(ex.message).to.equal('MENTOR MUST BE TEACHER');
        }
      });
    });
    describe('when a mentor is a TEACHER', () => {
      xit('can be created', async () => {
        const lucy = users.LUCY;
        await User.create({ name: 'JERRY', mentorId: lucy.id });
      });
    });
  });

  describe('updating', () => {
    describe('when a mentor is not a TEACHER', () => {
      xit('can NOT be updated', async () => {
        const eddy = users.EDDY;
        const wanda = users.WANDA;
        try {
          await eddy.update({ mentorId: wanda.id });
          throw Error('noooo');
        } catch (ex) {
          expect(ex.message).to.equal('MENTOR MUST BE TEACHER');
        }
      });
    });
    describe('when a mentor is a TEACHER', () => {
      xit('can be updated', async () => {
        const eddy = users.EDDY;
        const lucy = users.LUCY;
        await eddy.update({ mentorId: lucy.id });
      });
    });
  });

  describe('deleting', () => {
    describe('a teacher WHO mentors', () => {
      xit('can NOT be deleted', async () => {
        const lucy = users.LUCY;
        try {
          await lucy.destroy();
          throw Error('noooo');
        } catch (ex) {
          expect(ex.message).to.equal('A MENTOR CAN NOT BE DELETED');
        }
      });
    });
    describe('a teacher who does not mentor', () => {
      xit('can be deleted', async () => {
        const moe = users.MOE;
        await moe.update({ mentorId: null });
        const lucy = users.LUCY;
        await lucy.destroy();
      });
    });
  });

  describe('isStudent virtual property', () => {
    describe('when the user is a STUDENT', () => {
      xit('is true', () => {
        expect(users.MOE.isStudent).to.equal(true);
      });
    });
    describe('when the user is NOT a STUDENT', () => {
      xit('is false', () => {
        expect(users.LUCY.isStudent).to.equal(false);
      });
    });
  });

  describe('isTeacher virtual property', () => {
    describe('when the user is a TEACHER', () => {
      xit('is true', () => {
        expect(users.LUCY.isTeacher).to.equal(true);
      });
    });
    describe('when the user is NOT a TEACHER', () => {
      xit('is false', () => {
        expect(users.MOE.isTeacher).to.equal(false);
      });
    });
  });

  describe('userType', () => {
    describe('changing to TEACHER', () => {
      describe('when the user is a mentee', () => {
        xit('userType can not be changed', async () => {
          const moe = users.MOE;
          moe.userType = 'TEACHER';
          try {
            await moe.save();
            throw Error('noooo');
          } catch (ex) {
            expect(ex.message).to.equal('A TEACHER CAN NOT HAVE A MENTOR');
          }
        });
      });
      describe('when the user is not a mentee', () => {
        beforeEach(async () => users.MOE.setMentor(null));
        xit('userType can be changed', async () => {
          const moe = users.MOE;
          moe.userType = 'TEACHER';
          await moe.save();
        });
      });
    });
    describe('changing to STUDENT', () => {
      describe('When the user has no mentees', () => {
        xit('userType can be changed', async () => {
          const moe = users.MOE;
          await moe.setMentor(null);
          const lucy = users.LUCY;
          lucy.userType = 'STUDENT';
          await lucy.save();
          expect(lucy.userType).to.equal('STUDENT');
        });
      });

      describe('when there ARE mentees', () => {
        xit('userType can NOT be changed', async () => {
          const lucy = users.LUCY;
          lucy.userType = 'STUDENT';
          try {
            await lucy.save();
            throw Error('noooo');
          } catch (ex) {
            expect(ex.message).to.equal('STUDENT CAN NOT HAVE MENTEES');
          }
        });
      });
    });
  });
});

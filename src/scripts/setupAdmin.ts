import { createAdminUser } from '../utils/createAdmin';

createAdminUser()
  .then(() => {
    console.log('Admin setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to setup admin:', error);
    process.exit(1);
  });
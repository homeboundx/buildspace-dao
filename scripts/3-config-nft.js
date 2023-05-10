import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const editionDrop = sdk.getEditionDrop('0x66916F4eB59c762eD10582e33dF94E3376bF7439');

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: 'DiplomaDAO Membership',
                description: 'This NFT grants you membership in DiplomaDAO',
                image: readFileSync('scripts/assets/DAOLogo.svg'),
            }
        ]);
        console.log('✅ Successfully created a new NFT in the drop');
    } catch (error) {
        console.error('Failed to create NFT:', error);
    }
})();
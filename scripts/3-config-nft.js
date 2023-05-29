import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

(async () => {
    try {
        const editionDrop = await sdk.getContract("0x5460b5Df786cc23BD02c068F38dEb093F95776b6", "edition-drop");
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
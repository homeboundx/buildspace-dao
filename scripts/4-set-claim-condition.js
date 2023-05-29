import sdk from './1-initialize-sdk.js';
import { MaxUint256 } from '@ethersproject/constants';

(async () => {
    try {
        const editionDrop = await sdk.getContract("0x5460b5Df786cc23BD02c068F38dEb093F95776b6", "edition-drop");
        const claimConditions = [{
            startTime: new Date(),
            maxQuantity: 50_000,
            price: 0,
            quantityLimitPerTransaction: 1,
            waitInSeconds: MaxUint256,
        }]

        await editionDrop.claimConditions.set('0', claimConditions);
        console.log('✅ Successfully set claim condition');
    } catch (error) {
        console.error('Failed to claim conditions:', error);
    }
})();
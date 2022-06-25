import sdk from './1-initialize-sdk.js';
import { MaxUint256 } from '@ethersproject/constants';

const editionDrop = sdk.getEditionDrop('0x66916F4eB59c762eD10582e33dF94E3376bF7439');

(async () => {
    try {
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
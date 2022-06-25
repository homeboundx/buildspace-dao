import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { useState, useEffect } from 'react';

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address: ", address);
  const editionDrop = useEditionDrop('0x66916F4eB59c762eD10582e33dF94E3376bF7439');
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log('This user has a membership NFT');
        } else {
          setHasClaimedNFT(false);
          console.log('This user does not have a membership NFT');
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error('Failed to get balance', error)
      };
    }
    checkBalance();
  }, [address, editionDrop]);
  
  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim('0', 1);
      console.log(`Successfully minted. Check your NFT on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error('Failed to mint NFT', error);
    } finally {
      setIsClaiming(false);
    }
  }

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to this DAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
    </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className='member-page'>
        <h1>ThisDAO Membership page</h1>
        <p>Congratulations on being a member!</p>
      </div>
    )
  }

  return (
    <div className="mint-nft">
      <h1>Mint your free membership of ThisDAO</h1>
      <button
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? 'Minting...' : 'Claim your free NFT'}
      </button>
    </div>
  );
};

export default App;

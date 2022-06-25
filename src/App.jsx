import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { useState, useEffect } from 'react';

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address: ", address);
  const editionDrop = useEditionDrop('0x66916F4eB59c762eD10582e33dF94E3376bF7439');
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

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

  return (
    <div className="landing">
      <h1>👀 wallet connected</h1>
    </div>
  );
};

export default App;

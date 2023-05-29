import {
  useAddress,
  useNetwork,
  useContract,
  ConnectWallet,
  Web3Button,
  useNFTBalance,
} from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from '@ethersproject/constants';

const App = () => {
  const address = useAddress();
  const network = useNetwork();
  console.log('👋 Address:', address);
  const editionDropAddress = '0x5460b5Df786cc23BD02c068F38dEb093F95776b6';
  const { contract: editionDrop } = useContract(
    editionDropAddress,
    'edition-drop',
  );
  const { contract: token } = useContract(
    '0xC7E49578F2BbD8Cfd9ed35F426051A080c59827C',
    'token',
  );
  const { contract: vote } = useContract(
    '0xcA77b5B6AE2EEd8E7DE7620d571a6271fE073F6c',
    'vote',
  );
  const { data: nftBalance } = useNFTBalance(editionDrop, address, '0');

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4);
  };

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log('🌈 Голосования:', proposals);
      } catch (error) {
        console.log('Не удалось получить голосования', error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log('🥵 Пользователь уже проголосовал');
        } else {
          console.log('🙂 Пользователь еще не голосовал');
        }
      } catch (error) {
        console.error('Не удалось проверить голосовали ли вы', error);
      }
    };
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop?.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log('🚀 Адреса участников', memberAddresses);
      } catch (error) {
        console.error('Не удалось получить адреса участников', error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log('👜 Количество токенов', amounts);
      } catch (error) {
        console.error('Не удалось получить балансы участников', error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // We're checking if we are finding the address in the memberTokenAmounts array.
      // If we are, we'll return the amount of token the user has.
      // Otherwise, return 0.
      const member = memberTokenAmounts?.find(
        ({ holder }) => holder === address,
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || '0',
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  if (address && network?.[0].data.chain.id !== ChainId.Goerli) {
    return (
      <div className="unsupported-network">
        <h2>Пожалуйста, переключитесь на Goerli</h2>
        <p>
          Это приложение работает на сети Goerli. Пожалуйста, смените сеть в верхнем меню MetaMask.
        </p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="landing">
        <h1>Добро пожаловать в DiplomaDAO</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>Страница участника DiplomaDAO</h1>
        <p>Поздравляю, теперь вы - участник DiplomaDAO</p>
        <div>
          <div>
            <h2>Список участников</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Адрес</th>
                  <th>Количество токенов</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Активные голосования</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                setIsVoting(true);

                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + '-' + vote.type,
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                try {
                  const delegation = await token.getDelegationOf(address);
                  if (delegation === AddressZero) {
                    await token.delegateTo(address);
                  }
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        const proposal = await vote.get(proposalId);
                        if (proposal.state === 1) {
                          return vote.vote(proposalId, _vote);
                        }
                        return;
                      }),
                    );
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          const proposal = await vote.get(proposalId);

                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        }),
                      );
                      setHasVoted(true);
                      console.log('Успешно проголосовали');
                    } catch (err) {
                      console.error('Не удалось проголосовать', err);
                    }
                  } catch (err) {
                    console.error('Не удалось проголосовать', err);
                  }
                } catch (err) {
                  console.error('Не удалось делегировать токены');
                } finally {
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => {
                      let translations = {
                        'Abstain': 'Воздержусь',
                        'Against': 'Против',
                        'For': 'За'
                      }

                      return (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + '-' + type}
                          name={proposal.proposalId}
                          value={type}
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + '-' + type}>
                          {translations[label]}
                        </label>
                      </div>
                    )
                    })}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? 'Голос отправляется...'
                  : hasVoted
                  ? 'Вы уже проголосовали'
                  : 'Отправить свои голоса'}
              </button>
              {!hasVoted && (
                <small>
                  Это действие вызовет несколько транзакций, которые вы должны будете подписать.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <h1>Получите бесплатный NFT участника DiplomaDAO</h1>
      <div className="btn-hero">
        <Web3Button
          contractAddress={editionDropAddress}
          action={(contract) => {
            contract.erc1155.claim(0, 1);
          }}
          onSuccess={() => {
            console.log(
              `🌊 Вы получили NFT. Проверьте его на OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`,
            );
          }}
          onError={(error) => {
            console.error('Не удалось получить NFT', error);
          }}
        >
          Получить
        </Web3Button>
      </div>
    </div>
  );
};

export default App;

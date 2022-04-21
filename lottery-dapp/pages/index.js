import { useState, useEffect } from "react";
import Head from "next/head";
import Web3 from "web3";
import lotteryContract from "../blockchain/lottery";
import styles from "../styles/Home.module.css";
import "bulma/css/bulma.css";

export default function Home() {
  const [web3, setWeb3] = useState();
  const [address, setAddress] = useState();
  const [lcContract, setLcContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (lcContract) {
      getPot();
    }
    if (lcContract) {
      getPlayers();
    }
  }, [lcContract, lotteryPot, players]);

  const enterLotteryHandler = async () => {
    try {
      await lcContract.methods.enter().send({
        from: address,
        value: web3.utils.toWei("0.01", "ether"),
        gas: 300000,
        gasPrice: null,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const getPot = async () => {
    const pot = await lcContract.methods.getBalance().call(); //reading only
    setLotteryPot(pot);
  };

  const getPlayers = async () => {
    const players = await lcContract.methods.getPlayers().call(); //reading only
    setPlayers(players);
  };

  const connectWalletHandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // create web3 instance
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        // get list of accounts
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
        // set account 1 to React State

        const lc = lotteryContract(web3);
        setLcContract(lc);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      console.log("Please Install Metamask");
    }
  };

  return (
    <div>
      <Head>
        <title>Ether Lottery</title>
        <meta name="description" content="An Ethereum Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav className="navbar mb-4 mt-4">
          <div className="container">
            <div className="navbar-brand">
              <h1>Ether Lottery</h1>
            </div>
            <div className="navbar-end">
              <button className="button is-link" onClick={connectWalletHandler}>
                Connect Wallet
              </button>
            </div>
          </div>
        </nav>
        <div className="container">
          <section className="mt-5">
            <div className="columns">
              <div className="column is-two-thirds">
                <section className="mt-5">
                  <p>Enter the lottery by sending 0.01 Ether</p>
                  <button
                    onClick={enterLotteryHandler}
                    className="button is-link is-large is-light mt-3"
                  >
                    Play Now
                  </button>
                </section>
                <section className="mt-6">
                  <p>
                    <b>Admin only: </b>Pick Winner
                  </p>
                  <button className="button is-primary is-large is-light mt-3">
                    Pick Winner
                  </button>
                </section>
              </div>
              <div className={`${styles.lotteryinfo}   column is-on-third"`}>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Lottery History</h2>
                        <div className="hitory-entry">
                          <div>Lottery #1 winner:</div>
                          <div>
                            <a href="https://etherscan.io/address/0xED98485593D5865E892f823e1f66FB99fE64F639">
                              0xED98485593D5865E892f823e1f66FB99fE64F639
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Players</h2>
                        <div>
                          {players.map((player) => {
                            <a
                              href={`https://etherscan.io/address/${player}`}
                              target="_blank"
                            >
                              {player}
                            </a>;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Pot</h2>
                        <p>{lotteryPot}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2022 Block Explorer</p>
      </footer>
    </div>
  );
}

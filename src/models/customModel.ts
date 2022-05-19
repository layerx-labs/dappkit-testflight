import {
  Model,
  Deployable,
  Web3Connection,
  Web3ConnectionOptions,
} from '@taikai/dappkit';
import {AbiItem} from 'web3-utils';

//TODO: Move to dappKit
export class CustomModel extends Model<any> implements Deployable {
  private _NetworkAbi: any = null;
  constructor(
    web3Connection: Web3Connection | Web3ConnectionOptions,
    NetworkAbi: any,
    contractAddress?: string
  ) {
    super(web3Connection, NetworkAbi?.abi as AbiItem[], contractAddress);
    this._NetworkAbi = NetworkAbi;
  }

  async deployJsonAbi(...args: any[])
   {
    const deployOptions = {
      data: this._NetworkAbi?.bytecode,
      arguments: [...args],
    };
    return this.deploy(deployOptions, this.web3Connection.Account);
  }
}

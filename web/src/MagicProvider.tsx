import {
  Client,
  AccountBalanceQuery,
  AccountInfoQuery,
  AccountRecordsQuery,
  TransactionReceiptQuery,
  AccountId,
  TransactionId,
  TransactionResponse,
  Provider,
  Hbar,
} from "@hashgraph/sdk";
export class MagicProvider implements Provider {
  _client: Client;
  constructor(
    hedera_network: "testnet" | "mainnet" | "previewnet" | "localhost"
  ) {
    if (!hedera_network) {
      throw new Error(
        "LocalProvider requires the `HEDERA_NETWORK` environment variable to be set"
      );
    }

    this._client = Client.forName(hedera_network);
    this._client.setMaxQueryPayment(new Hbar(100));
  }

  getLedgerId() {
    return this._client.ledgerId;
  }

  getNetwork() {
    return this._client.network;
  }

  getMirrorNetwork() {
    return this._client.mirrorNetwork;
  }

  getAccountBalance(accountId: string | AccountId) {
    return new AccountBalanceQuery()
      .setAccountId(accountId)
      .execute(this._client);
  }

  getAccountInfo(accountId: string | AccountId) {
    return new AccountInfoQuery().setAccountId(accountId).execute(this._client);
  }

  /**
   * @param {AccountId | string} accountId
   * @returns {Promise<TransactionRecord[]>}
   */
  getAccountRecords(accountId: string | AccountId) {
    return new AccountRecordsQuery()
      .setAccountId(accountId)
      .execute(this._client);
  }

  /**
   * @param {TransactionId | string} transactionId
   * @returns {Promise<TransactionReceipt>}
   */
  getTransactionReceipt(transactionId: string | TransactionId) {
    return new TransactionReceiptQuery()
      .setTransactionId(transactionId)
      .execute(this._client);
  }

  /**
   * @param {TransactionResponse} response
   * @returns {Promise<TransactionReceipt>}
   */
  waitForReceipt(response: TransactionResponse) {
    return new TransactionReceiptQuery()
      .setNodeAccountIds([response.nodeId])
      .setTransactionId(response.transactionId)
      .execute(this._client);
  }

  /**
   * @template RequestT
   * @template ResponseT
   * @template OutputT
   * @param {Executable<RequestT, ResponseT, OutputT>} request
   * @returns {Promise<OutputT>}
   */
  call(request: any) {
    return request.execute(this._client);
  }
}

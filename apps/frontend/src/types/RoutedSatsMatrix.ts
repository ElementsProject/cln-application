import { RoutingEvent } from "./lightning-volume.type";

export type NodeId = string;
export type SatsRouted = number;

/**
 * Matrix to map where sats where routed.
 * 23 sats were routed from node2 to node0.
 * node0 to node0 is 0 because you can't route sats to yourself.
 *      to  node0|node1|node2
 * from          |     |
 * node0:    0   |1700 | 123
 * node1:    0   |  0  | 345
 * node2:   23   |  5  |   0
 */
export class RoutedSatsMatrix {
  private matrix: Map<NodeId, Map<NodeId, SatsRouted>>;

  constructor(nodeIdList: NodeId[], routingEventsList: RoutingEvent[]) {
    this.matrix = new Map();

    nodeIdList.forEach((nodeId: NodeId) => {
      let innerMap: Map<NodeId, SatsRouted> = new Map();
      nodeIdList.forEach((innerNode: NodeId) => {
        innerMap.set(innerNode, 0);
      });
      this.matrix.set(nodeId, innerMap);
    });

    for (let event of routingEventsList) {
      let from: NodeId = event.from;
      let to: NodeId = event.to;

      if (!this.matrix.has(from) || !this.matrix.has(from)) {
        continue;
      }

      let currentSats: SatsRouted = this.matrix.get(from)!.get(to)!;
      this.matrix.get(from)!.set(to, currentSats + event.amountSat);
    }
  }

  getSats(from: NodeId, to: NodeId): SatsRouted | undefined {
    return this.matrix.get(from)?.get(to);
  }

  get totalAmountSat(): number {
    let totalAmountSat = 0;
    for (let [fromNode, toMap] of this.matrix) {
      for (let [toNode, sats] of toMap) {
        totalAmountSat += sats;
      }
    }
    return totalAmountSat;
  }

  getMatrix(): Map<NodeId, Map<NodeId, SatsRouted>> {
    return this.matrix;
  }

  toJSON() {
    let obj = {};
    for (let [key, value] of this.matrix) {
      obj[key] = Array.from(value.entries());
    }
    return obj;
  }
}

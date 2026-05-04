class LeaveRequest {
  constructor(type, days) {
    this.type = type;
    this.days = days;
    this.status = "Pending";
  }
}

class InventoryItem {
  constructor(name) {
    this.name = name;
    this.status = "Available";
  }
}

class PTOManager {
  constructor() {
    this.leaves = JSON.parse(localStorage.getItem("leaves")) || [];
    this.inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    this.renderLeaves(this.leaves);
    this.renderInventory(this.inventory);
  }

  save() {
    localStorage.setItem("leaves", JSON.stringify(this.leaves));
    localStorage.setItem("inventory", JSON.stringify(this.inventory));
  }

  // ----- LEAVES -----
  addLeave() {
    const type = leaveType.value;
    const days = leaveDays.value;
    if (!type || !days) return;

    this.leaves.push(new LeaveRequest(type, days));
    this.save();
    this.renderLeaves(this.leaves);
    leaveType.value = "";
    leaveDays.value = "";
  }

  renderLeaves(data) {
    leaveList.innerHTML = "";
    data.forEach((leave, i) => {
      const badge =
        leave.status === "Approved" ? "bg-green-500" :
        leave.status === "Rejected" ? "bg-red-500" :
        "bg-yellow-500";

      leaveList.innerHTML += `
        <li class="bg-white p-4 rounded shadow flex justify-between items-center">
          <span>${leave.type} - ${leave.days} days</span>
          <div class="flex gap-2 items-center">
            <span class="text-white text-xs px-2 py-1 rounded ${badge}">
              ${leave.status}
            </span>
            <button onclick="manager.updateLeave(${i})" class="text-blue-600">Approve</button>
            <button onclick="manager.deleteLeave(${i})" class="text-red-600">Delete</button>
          </div>
        </li>`;
    });
  }

  updateLeave(i) {
    this.leaves[i].status = "Approved";
    this.save();
    this.renderLeaves(this.leaves);
  }

  deleteLeave(i) {
    this.leaves.splice(i, 1);
    this.save();
    this.renderLeaves(this.leaves);
  }

  filterLeaves(status) {
    status === "All"
      ? this.renderLeaves(this.leaves)
      : this.renderLeaves(this.leaves.filter(l => l.status === status));
  }

  // ----- INVENTORY -----
  addInventory() {
    const name = assetName.value;
    if (!name) return;

    this.inventory.push(new InventoryItem(name));
    this.save();
    this.renderInventory(this.inventory);
    assetName.value = "";
  }

  renderInventory(data) {
    inventoryList.innerHTML = "";
    data.forEach((item, i) => {
      const badge = item.status === "Available" ? "bg-green-500" : "bg-gray-500";

      inventoryList.innerHTML += `
        <li class="bg-white p-4 rounded shadow flex justify-between items-center">
          <span>${item.name}</span>
          <div class="flex gap-2 items-center">
            <span class="text-white text-xs px-2 py-1 rounded ${badge}">
              ${item.status}
            </span>
            <button onclick="manager.toggleAsset(${i})" class="text-blue-600">
              Toggle
            </button>
            <button onclick="manager.deleteInventory(${i})" class="text-red-600">
              Delete
            </button>
          </div>
        </li>`;
    });
  }

  toggleAsset(i) {
    this.inventory[i].status =
      this.inventory[i].status === "Available" ? "Assigned" : "Available";
    this.save();
    this.renderInventory(this.inventory);
  }

  deleteInventory(i) {
    this.inventory.splice(i, 1);
    this.save();
    this.renderInventory(this.inventory);
  }

  filterInventory(status) {
    status === "All"
      ? this.renderInventory(this.inventory)
      : this.renderInventory(this.inventory.filter(i => i.status === status));
  }
}

const manager = new PTOManager();

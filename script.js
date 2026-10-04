/* =========================
   GARDENIA GREENHOUSE
   ORDER SYSTEM + EMAILJS
========================= */

let order = [];


/* =========================
   EMAILJS
========================= */

emailjs.init({
    publicKey: "91HuOxrXCt117zzEp"
});


/* =========================
   ADD ITEM
========================= */

function addToOrder(name, price) {

    const existingItem = order.find(
        item => item.name === name
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        order.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateOrder();

    document
        .getElementById("order")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================
   UPDATE ORDER
========================= */

function updateOrder() {

    const orderContainer =
        document.getElementById("orderItems");

    const emptyOrder =
        document.getElementById("emptyOrder");

    const totalPrice =
        document.getElementById("totalPrice");

    orderContainer.innerHTML = "";

    if (order.length === 0) {

        emptyOrder.style.display = "block";
        totalPrice.textContent = "₱0";

        return;
    }

    emptyOrder.style.display = "none";

    let total = 0;

    order.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        const itemElement =
            document.createElement("div");

        itemElement.className = "order-item";

        itemElement.innerHTML = `

            <div class="item-info">

                <strong>
                    ${item.name}
                </strong>

                <small>
                    ₱${item.price} each
                </small>

            </div>

            <div class="item-controls">

                <button
                    class="quantity-button"
                    onclick="changeQuantity(${index}, -1)"
                >
                    −
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    class="quantity-button"
                    onclick="changeQuantity(${index}, 1)"
                >
                    +
                </button>

                <button
                    class="remove-button"
                    onclick="removeItem(${index})"
                >
                    Remove
                </button>

            </div>

        `;

        orderContainer.appendChild(itemElement);

    });

    totalPrice.textContent = `₱${total}`;
}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQuantity(index, amount) {

    order[index].quantity += amount;

    if (order[index].quantity <= 0) {
        order.splice(index, 1);
    }

    updateOrder();
}


/* =========================
   REMOVE ITEM
========================= */

function removeItem(index) {

    order.splice(index, 1);

    updateOrder();
}


/* =========================
   SUBMIT ORDER
========================= */

document
    .getElementById("orderForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        if (order.length === 0) {

            alert(
                "Please add at least one item to your order."
            );

            return;
        }

        const name =
            document.getElementById("name").value.trim();

        const section =
            document.getElementById("section").value.trim();

        const notes =
            document.getElementById("notes").value.trim();

        if (!name || !section) {

            alert(
                "Please complete your customer details."
            );

            return;
        }


        /* =========================
           CREATE ORDER DETAILS
        ========================= */

        let orderDetails = "";

        order.forEach(item => {

            const itemTotal =
                item.price * item.quantity;

            orderDetails +=
                `${item.name} x${item.quantity} - ₱${itemTotal}\n`;

        });


        /* =========================
           CALCULATE TOTAL
        ========================= */

        let total = 0;

        order.forEach(item => {

            total +=
                item.price * item.quantity;

        });


        /* =========================
           EMAILJS DATA
        ========================= */

        const templateParams = {

            customer_name: name,

            section: section,

            order_details: orderDetails,

            total: total,

            notes: notes || "No notes"

        };


        /* =========================
           SEND EMAIL
        ========================= */

        emailjs
            .send(
                "gardenia_greenhouse",
                "template_9mu19pm",
                templateParams
            )

            .then(function(response) {

                console.log(
                    "ORDER SENT!",
                    response.status,
                    response.text
                );

                document
                    .getElementById("successModal")
                    .classList.add("active");

            })

            .catch(function(error) {

                console.error(
                    "EMAIL ERROR:",
                    error
                );

                alert(
                    "Something went wrong while sending your order. Please try again."
                );

            });

    });


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

    document
        .getElementById("successModal")
        .classList.remove("active");

    document
        .getElementById("orderForm")
        .reset();

    order = [];

    updateOrder();
}


/* =========================
   CLOSE MODAL BY CLICKING
   OUTSIDE
========================= */

document
    .getElementById("successModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeModal();

        }

    });
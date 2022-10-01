const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')

router.get('/', async (req, res) => {
    try {
        const items = await customerController.getAll()
        if (!items) {
            res.status(404).send('Not found items')
        } else {
            res.json(items)
        }
    } catch (error) {
        res.status({ error: 'could not retrieve customers' })
    }
})
router.get('/credits', async (req, res) => {
    try {
        const items = await customerController.getAllByCredit()
        if (!items) {
            res.status(404).send('Not found items')
        } else {
            res.json(items)
        }
    } catch (error) {
        res.status({ error: 'could not retrieve customers' })
    }
})
router.post('/', async (req, res) => {
    const { customerId, name, email, phone, country } = req.body

    if (!name | !email | !phone | !country | !customerId ) {
        res.status(400).json({ error: "name, email, phone, country not provided" })
        return
    }

    const newCustomer = {
        customerId: customerId,
        name: name,
        email: email,
        phone: phone,
        country: country
    }

    try {
        await customerController.create(newCustomer)
        res.json(newCustomer)
    } catch (error) {
        res.status(500).json({ error: "Could not create customer" });
    }
})
router.put('/:customerId', async (req, res) => {
    const { name, email, phone, country } = req.body
    const { customerId } = req.params
    if (!customerId) {
        res.status(400).json({ error: 'you have to send customerId' })
        return
    }
    if (!name | !email | !phone | !country) {
        res.status(400).json({ error: "name, email, phone, country not provided" })
        return
    }

    const customer = {
        name,
        email,
        phone,
        country
    }

    try {
        await customerController.update(customerId, customer)
        res.json(`${customerId} updated successfully`)
    } catch (error) {
        res.status(500).json({ error: "Could not update customer" });
    }

})
router.put('/credit/:customerId', async (req, res) => {
    const { credit } = req.body
    const { customerId } = req.params
    if (!customerId) {
        res.status(400).json({ error: 'you have to send customerId' })
        return
    }
    if (!credit) {
        res.status(400).json({ error: "credit value not provided" })
        return
    }

    try {
        await customerController.updateCredit(customerId, credit)
        res.json(`${credit} added to ${customerId} successfully`)
    } catch (error) {
        res.status(500).json({ error: "Could not add credit to customer" });
    }

})
router.delete('/:customerId', async (req, res) => {
    const { customerId } = req.params
    if (!customerId) {
        res.status(400).json({ error: 'you have to send customerId' })
        return
    }

    try {
        await customerController.deleteOne(customerId)
        res.json(`${customerId} deleted successfully`)
    } catch (error) {
        res.status(500).json({ error: error });
    }

})

module.exports = router




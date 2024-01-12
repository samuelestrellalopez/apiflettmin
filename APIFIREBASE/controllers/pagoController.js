// pagosController.js
const express = require('express');
const router = express.Router();

const stripe = require('stripe')('sk_test_51OXKzHCk3goIqpDbM67xtecKupOqBAdqyF55DxrOmoxGfQpuEmDc4AHHvoYDOEPjXa8YSAks8UikZUMxkpHau61N00Q2JYmGBQ');
const stripeConfig = {
  apiKey: 'pk_test_51OXKzHCk3goIqpDb5Md3YWkwppwa3Jaubt1NnWgXKTrntfEr8dFEuyrWTCL1Lw776vkEypsGUtpTV6ZogGfK8DVX00vTBulOCj',
};


router.post('/pagos/:fleteId', async (req, res) => {
    try {
        const { fleteId } = req.params;

        const fleteDoc = await Flete.doc(fleteId).get();
        if (!fleteDoc.exists) {
            res.status(404).json({ error: 'Flete not found' });
            return;
        }

        const flete = fleteDoc.data();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: flete.monto, 
            currency: 'usd', 
        });

        res.send({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

    
});

module.exports = router;

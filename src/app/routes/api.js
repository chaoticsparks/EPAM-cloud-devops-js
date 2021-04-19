const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

const storedQuotes = require('../quotes.json');
const quotesFilePath = path.join(__dirname, '..', 'quotes.json');

const save = async () => {
    try {
        await fs.writeFile(quotesFilePath, JSON.stringify(storedQuotes));
    } catch (e) {
        throw e;
    }
};

router.post('/quotes', async (req, res, next) => {
    const postData = req.body;

    if (!Object.keys(postData).length) {
        return res.sendStatus(404);
    }

    const {
        quote: { author, text },
    } = postData;

    if (!author || !text) {
        return res.sendStatus(400);
    }

    storedQuotes.push({
        ...postData.quote,
        id: String(storedQuotes.length + 1),
        isDeleted: false,
        createdAt: new Date(),
    });

    await save();

    return res.status(200).end();
});

router.put('/quotes/:id', async (req, res) => {
    const postData = req.body;
    const foundIndex = storedQuotes.findIndex(
        (quote) => quote.id === req.params.id
    );

    if (typeof foundIndex !== 'undefined') {
        const { author, text } = postData;

        if (!author || !text) {
            return res.sendStatus(400);
        }

        storedQuotes[foundIndex] = {
            ...storedQuotes[foundIndex],
            ...postData,
            updatedAt: new Date(),
        };

        await save();

        return res.status(200).end();
    }

    return res.status(404).end();
});

router.delete('/quotes/:id', async (req, res) => {
    const foundIndex = storedQuotes.findIndex(
        (quote) => quote.id === req.params.id
    );

    if (typeof foundIndex !== 'undefined') {
        storedQuotes[foundIndex].isDeleted = true;

        await save();

        return res.status(200).end();
    }

    return res.status(404).end();
});

router.get('/quotes', async (req, res) => {
    return res.json({ data: storedQuotes });
});

router.get('/quotes/random', async (req, res) => {
    const requestedTag = req.query?.tag;

    let filteredQuotes = storedQuotes;

    if (requestedTag) {
        filteredQuotes = storedQuotes.filter((quote) =>
            quote.tags.includes(requestedTag)
        );
    }

    return res.json({
        data: filteredQuotes[(filteredQuotes.length * Math.random()) | 0],
    });
});

router.get('/quotes/:id', async (req, res) => {
    const requestedQuote = storedQuotes.find(
        (quote) => quote.id === req.params.id
    );

    if (requestedQuote) {
        return res.json({ data: requestedQuote });
    }

    return res.status(404).end();
});

module.exports = router;

import express from 'express'
import dotenv from 'dotenv'
import { Octokit } from 'octokit'
import fetch from 'node-fetch'

dotenv.config()

const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN,
    request: {
        fetch
    }
})

const app = express()

app.use(express.json())


const router = express.Router()

app.use('/api/v1', router)

router.get('/', (req, res) => {
    res.json({ 'message': 'Hello World' })
})

router.get('/issues', async (req, res) => {
    // use octokit to get issues of a project
    try {
        const { projectName } = req.body

        const issues = await octokit.rest.issues
            .listForRepo({
                owner: process.env.GITHUB_USERNAME,
                repo: projectName
            })

        res.status(200).json(issues).end()
    } catch (err) {
        console.error(err)
        res.status(500).json(err).end()
    }
})

router.post('/issues', async (req, res) => {
    // use octokit to create an issue
    try {
        const { projectName, issueTitle, issueDescription } = req.body

        const createIssue = await octokit.rest.issues
            .create({
                owner: process.env.GITHUB_USERNAME,
                repo: projectName,
                title: issueTitle,
                body: issueDescription
            })

        res.status(201).json({ "url": createIssue.data.html_url }).end()
    } catch (err) {
        res.status(500).json(err).end()
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
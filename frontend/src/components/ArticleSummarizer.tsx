import { useState } from 'react'
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Heading,
  Flex,
  IconButton,
  useToast,
  ScaleFade,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const isValidUrl = (str: string) => {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

const ArticleSummarizer = () => {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSummary('')
    setError('')

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/summarize`, { url })
      setSummary(response.data.summary)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Something went wrong. Please try again.')
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    toast({
      title: 'Copied!',
      description: 'Summary copied to clipboard.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Card w="100vw" h="100vh" borderRadius="0" bg="blue.600">
      <CardBody p={0}>
        <Flex direction="column" justify="space-between" h="100%">
          <Flex align="center" justify="center" flex="1">
            <Box w="full" maxW="3xl" px={4} color="white">
              <Stack spacing={8}>
                <Box textAlign="center">
                  <Heading as="h1" size="2xl" mb={2}>
                    Article Summarizer
                  </Heading>
                  <Text fontSize="lg" color="whiteAlpha.800">
                    Paste a URL and get a short, readable summary
                  </Text>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <Box>
                      <Text mb={2} fontWeight="semibold" color="whiteAlpha.900">
                        Article URL
                      </Text>
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/article"
                        required
                        size="lg"
                        variant="filled"
                        focusBorderColor="blue.300"
                        bg="white"
                        color="black"
                      />
                    </Box>
                    <Button
                      type="submit"
                      colorScheme="whiteAlpha"
                      isLoading={isLoading}
                      loadingText="Summarizing..."
                      size="lg"
                      isDisabled={!url.trim() || isLoading}
                    >
                      Summarize
                    </Button>
                  </Stack>
                </form>

                {error && (
                  <ScaleFade in={!!error}>
                    <Box p={4} bg="red.100" color="red.700" borderRadius="md" shadow="sm">
                      <Text>{error}</Text>
                    </Box>
                  </ScaleFade>
                )}

                {summary && (
                  <ScaleFade in={!!summary}>
                    <Card shadow="md" bg="white" borderRadius="xl" color="black">
                      <CardHeader pb={0}>
                        <Flex justify="space-between" align="center">
                          <Text fontSize="xl" fontWeight="bold">
                            Summary
                          </Text>
                          <IconButton
                            size="sm"
                            aria-label="Copy summary"
                            icon={<CopyIcon />}
                            onClick={handleCopy}
                            variant="ghost"
                          />
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Box
                          maxH="300px"
                          overflowY="auto"
                          fontSize="md"
                          lineHeight="tall"
                          whiteSpace="pre-wrap"
                          px={1}
                        >
                          {summary}
                        </Box>
                      </CardBody>
                    </Card>
                  </ScaleFade>
                )}
              </Stack>
            </Box>
          </Flex>

          {/* 👇 Footer at bottom of full-page card */}
          <Box textAlign="center" mt="auto" py={4}>
            <Text fontSize="sm" color="whiteAlpha.700">
              Built with 💙 using Chakra UI + Vite
            </Text>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default ArticleSummarizer
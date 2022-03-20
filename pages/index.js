
import React from 'react'
import { Box, VStack, Text, Checkbox, HStack, Button, Grid, GridItem, Spinner, Center } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


const parishes = ['St. Ann', 'St. Andrew', 'St. Thomas', 'St. Elizabeth', 'St. Mary', 'St. James', 'Clarendon', 'Trelawny', 'Hanover', 'Westmoreland', 'Manchester', 'Portland', 'Kingston', 'St. Catherine']

export default function Home({ count, doc, id, isError }) {
  const [checkedItems, setCheckedItems] = React.useState(parishes.map(_ => false))
  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked


  const [isLoading, setIsLoading] = React.useState(false)
  const [currentId, setId] = React.useState(id)
  const [currentDoc, setCurrentDoc] = React.useState(doc)

  const handleCheck = (e, index) => {
    var checkItemList = checkedItems.slice()
    checkItemList[index] = !checkItemList[index]
    setCheckedItems(checkItemList)
  }

  const handleCheckAll = () => {
    var checkItemList = checkedItems.slice()
    checkItemList = checkItemList.map(checked => true)
    setCheckedItems(checkItemList)
  }


  const handleSkip = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${window.location.origin}/api/getTest`)
      const data = await response.json()
      setCheckedItems(parishes.map(_ => false))
      setCurrentDoc(data.doc)
      setId(data.id)
    } catch (error) {
      alert('Something went wrong')
    }
    setIsLoading(false)
  }


  const handleSubmit = async () => {
    const answers = parishes.filter((_, index) => checkedItems[index])
    try {
      setIsLoading(true)
      const response = await fetch(`${window.location.origin}/api/submitAnswers`, {
        method: 'POST',
        body: JSON.stringify({ answers, id: currentId })
      })

      const data = await response.json()
      if (!data) throw new Error('Not Sent')

      await handleSkip()
    } catch (error) {
      alert('Something went wrong')
    }
    setIsLoading(false)
  }



  return (
    <Center>
      <Box paddingX={{sm: 20, md: 60, lg: 80 }} paddingY={30} >

        <VStack >

          {isLoading ? (
            <Box>
              <Spinner label='Please wait...' />
            </Box>
          ) : (
            <Box>
              <Text fontWeight={500} my={10} >Select the parishes that the following passage applies to, Skip if you are not sure; </Text>

              <Box width={'full'} bgColor={'blue.600'} padding={5} borderRadius={2}>
                <Text textAlign={'center'} fontWeight={'medium'} fontSize={'xs'} color={'white'} textTransform={'uppercase'} >{`${currentDoc?.content}`}</Text>
              </Box>

              <Box border={'1px'} bgColor={'whitesmoke'} paddingX={10} paddingY={3} my={10}>
                <Text fontSize={'xs'} color={'gray.400'} >{currentId}</Text>
                <Checkbox onChange={() => handleCheckAll()} isChecked={allChecked} isIndeterminate={isIndeterminate} my={2} width={'full'} value={''}>All</Checkbox>
                {parishes.map((parish, key) => {
                  return (
                    <Checkbox onChange={(e) => handleCheck(e, key)} isChecked={checkedItems[key]} key={key} my={2} width={'full'} value={parish}>{parish}</Checkbox>
                  )
                })}

                <HStack mt={10} width={'full'}>
                  <Button onClick={handleSkip} colorScheme={'blackAlpha'} width={'full'}>Skip</Button>
                  <Button onClick={handleSubmit} color={'white'} bgColor={'green.400'} width={'full'}>Next</Button>
                </HStack>

              </Box>
            </Box>
          )}
        </VStack>
      </Box>
    </Center>


  )
}



export async function getServerSideProps(context) {

  var props = {
    doc: null,
    count: 0
  }

  try {
    const response = await fetch(`${process.env.ORIGIN_URL}/api/getTest`)
    const data = await response.json()
    props = data
  } catch (error) {
    console.log(error.message)
  }

  // try {
  //   const response = await fetch(`${process.env.ORIGIN_URL}/api/setData`)
  //   const data = await response.json()
  //   props = data
  // } catch (error) {
  //   console.log(error.message)
  // }
  return {
    props
  }
}
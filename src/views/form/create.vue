<template>
  <div>
    <article-detail :is-edit='false'></article-detail>


  </div>

</template>
<script>

  import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'createForm',
  components: { ArticleDetail }
}
</script>


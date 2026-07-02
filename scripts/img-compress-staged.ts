import prompts from 'prompts'
import Git from 'simple-git'
import { compressImages } from './img-compress'

const IMAGES_DIRS = ['public/images/'] as const

const git = Git()
const stagedFiles = (await git.diff(['--cached', '--name-only']))
  .split('\n')
  .map(i => i.trim())
  .filter(Boolean)

const images = stagedFiles.filter(
  f =>
    IMAGES_DIRS.some(dir => f.startsWith(dir))
    && /\.(png|jpe?g|webp)$/i.test(f),
)

if (images.length === 0) {
  console.log('No images to compress')
  process.exit(0)
}

console.log('Images to compress:\n', images)
const { confirm } = await prompts({
  type: 'confirm',
  name: 'confirm',
  message: `Compress ${images.length} images?`,
  initial: true,
})

if (!confirm) process.exit(0)

await compressImages(images)
